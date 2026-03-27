import type { TradingExchangeMethods as TM } from "../../src/methods/index.ts";
import {
    cleanupSubscriptions,
    msFromNow,
    setupInfoClient,
    setupSubscriptionClient,
    setupTradingClient,
} from "../utils/example_utils.ts";

type Side = "b" | "s";

type TradePoint = {
    timestamp: number;
    side: Side;
    size: number;
};

type BboState = {
    bid: number;
    ask: number;
    timestamp: number;
};

type FlowSignal = {
    pressure: number;
    total: number;
};

const SYMBOL = "BTC-PERP";
const RUNTIME_SECONDS = 90;
const REQUOTE_INTERVAL_MS = 1_500;
const SIGNAL_WINDOW_MS = 8_000;
const BBO_STALE_MS = 4_000;

const BASE_ORDER_SIZE = 0.003;
const MAX_ORDER_SIZE = 0.02;
const MIN_FLOW_VOLUME = 0.02;

const INSIDE_QUOTE_TICKS = 1;
const MAX_PRESSURE_TICKS = 3;
const CROSS_ON_STRONG_SIGNAL_TICKS = 1;
const STRONG_SIGNAL_THRESHOLD = 0.75;

const SIZE_DECIMALS = 4;
const FALLBACK_TICK_SIZE = 0.1;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForWebSocketSetup(
    transport: { isConnected: () => boolean },
    label: string,
    timeoutMs = 15_000,
): Promise<void> {
    const deadline = Date.now() + timeoutMs;

    while (!transport.isConnected() && Date.now() < deadline) {
        await sleep(100);
    }

    if (!transport.isConnected()) {
        throw new Error(`${label} websocket was not ready within ${timeoutMs}ms.`);
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function toNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return null;
}

function normalizeSide(value: unknown): Side | null {
    if (typeof value !== "string") {
        return null;
    }

    const side = value.toLowerCase();
    if (side === "b" || side === "buy") {
        return "b";
    }

    if (side === "s" || side === "sell") {
        return "s";
    }

    return null;
}

function normalizeTimestamp(value: unknown): number {
    const parsed = toNumber(value);
    if (parsed === null || parsed <= 0) {
        return Date.now();
    }

    // Some feeds return seconds; normalize to milliseconds.
    return parsed < 10_000_000_000 ? parsed * 1_000 : parsed;
}

function parseBbo(detail: unknown): BboState | null {
    const candidate = Array.isArray(detail) ? detail[0] : detail;
    if (!isRecord(candidate)) {
        return null;
    }

    const bid = toNumber(
        candidate.best_bid_price ?? candidate.bid ?? candidate.bid_price,
    );
    const ask = toNumber(
        candidate.best_ask_price ?? candidate.ask ?? candidate.ask_price,
    );

    if (bid === null || ask === null || bid <= 0 || ask <= 0 || ask <= bid) {
        return null;
    }

    const timestamp = normalizeTimestamp(
        candidate.timestamp ?? candidate.time ?? candidate.last_updated,
    );

    return { bid, ask, timestamp };
}

function parseTrades(detail: unknown): TradePoint[] {
    const sourceItems = Array.isArray(detail) ? detail : [detail];
    const parsed: TradePoint[] = [];

    for (const item of sourceItems) {
        if (!isRecord(item)) {
            continue;
        }

        const tradeItems = Array.isArray(item.trades) ? item.trades : [item];
        for (const trade of tradeItems) {
            if (!isRecord(trade)) {
                continue;
            }

            const side = normalizeSide(trade.side ?? trade.taker_side ?? trade.direction);
            const size = toNumber(trade.size ?? trade.amount ?? trade.qty);
            if (side === null || size === null || size <= 0) {
                continue;
            }

            parsed.push({
                side,
                size,
                timestamp: normalizeTimestamp(trade.timestamp ?? trade.time ?? trade.ts),
            });
        }
    }

    return parsed;
}

function pruneTrades(trades: TradePoint[]): void {
    const cutoff = Date.now() - SIGNAL_WINDOW_MS;
    while (trades.length > 0 && trades[0].timestamp < cutoff) {
        trades.shift();
    }
}

function buildFlowSignal(trades: TradePoint[]): FlowSignal {
    let buyVolume = 0;
    let sellVolume = 0;

    for (const trade of trades) {
        if (trade.side === "b") {
            buyVolume += trade.size;
        } else {
            sellVolume += trade.size;
        }
    }

    const total = buyVolume + sellVolume;
    if (total < MIN_FLOW_VOLUME) {
        return { pressure: 0, total };
    }

    const pressure = (buyVolume - sellVolume) / total;
    return {
        pressure: Math.max(-1, Math.min(1, pressure)),
        total,
    };
}

function decimalsFromStep(step: number): number {
    let decimals = 0;
    let scaled = step;

    while (!Number.isInteger(scaled) && decimals < 10) {
        scaled *= 10;
        decimals += 1;
    }

    return decimals;
}

function roundToStep(value: number, step: number): number {
    const decimals = decimalsFromStep(step);
    return Number((Math.round(value / step) * step).toFixed(decimals));
}

function computeOrderSize(signal: FlowSignal): number {
    const scale = 1 + Math.min(signal.total / MIN_FLOW_VOLUME, 5);
    return Math.min(MAX_ORDER_SIZE, BASE_ORDER_SIZE * scale);
}

function computeAggressiveQuotePrices(
    tickSize: number,
    bbo: BboState,
    signal: FlowSignal,
): { bidPrice: number; askPrice: number } {
    const spreadTicks = Math.max(1, Math.round((bbo.ask - bbo.bid) / tickSize));

    let bidPrice = bbo.bid;
    let askPrice = bbo.ask;

    if (spreadTicks > 1) {
        bidPrice += INSIDE_QUOTE_TICKS * tickSize;
        askPrice -= INSIDE_QUOTE_TICKS * tickSize;
    }

    const pressureTicks = Math.round(Math.abs(signal.pressure) * MAX_PRESSURE_TICKS);
    if (signal.pressure > 0) {
        bidPrice += pressureTicks * tickSize;
        askPrice += Math.max(0, pressureTicks - 1) * tickSize;
    } else if (signal.pressure < 0) {
        askPrice -= pressureTicks * tickSize;
        bidPrice -= Math.max(0, pressureTicks - 1) * tickSize;
    }

    if (signal.pressure >= STRONG_SIGNAL_THRESHOLD) {
        bidPrice += CROSS_ON_STRONG_SIGNAL_TICKS * tickSize;
    } else if (signal.pressure <= -STRONG_SIGNAL_THRESHOLD) {
        askPrice -= CROSS_ON_STRONG_SIGNAL_TICKS * tickSize;
    }

    bidPrice = roundToStep(bidPrice, tickSize);
    askPrice = roundToStep(askPrice, tickSize);

    if (askPrice <= bidPrice) {
        askPrice = roundToStep(bidPrice + tickSize, tickSize);
    }

    return { bidPrice, askPrice };
}

function buildQuoteOrders(
    instrumentId: number,
    tickSize: number,
    bbo: BboState,
    signal: FlowSignal,
): {
    orders: TM.IUnitOrder[];
    bidPrice: number;
    askPrice: number;
    size: number;
} {
    const { bidPrice, askPrice } = computeAggressiveQuotePrices(tickSize, bbo, signal);
    const size = computeOrderSize(signal);

    const priceDecimals = decimalsFromStep(tickSize);
    const sizeText = size.toFixed(SIZE_DECIMALS);
    const cloidBase = `agg-mm-${Date.now()}`;

    const orders: TM.IUnitOrder[] = [
        {
            instrumentId,
            side: "b",
            positionSide: "BOTH",
            price: bidPrice.toFixed(priceDecimals),
            size: sizeText,
            tif: "GTC",
            ro: false,
            po: false,
            cloid: `${cloidBase}-b`,
            triggerPx: "",
            isMarket: false,
            tpsl: "",
            grouping: "",
        },
        {
            instrumentId,
            side: "s",
            positionSide: "BOTH",
            price: askPrice.toFixed(priceDecimals),
            size: sizeText,
            tif: "GTC",
            ro: false,
            po: false,
            cloid: `${cloidBase}-s`,
            triggerPx: "",
            isMarket: false,
            tpsl: "",
            grouping: "",
        },
    ];

    return { orders, bidPrice, askPrice, size };
}

async function resolveBtcPerpInstrument(): Promise<{ instrumentId: number; tickSize: number }> {
    const { info, ws_transport } = setupInfoClient();

    try {
        const instruments = await info.instruments({ type: "perps" });
        const btcPerp = instruments.perps.find((instrument) => instrument.name === SYMBOL);

        if (!btcPerp) {
            throw new Error(`Could not find ${SYMBOL} in perps instruments list.`);
        }

        return {
            instrumentId: btcPerp.id,
            tickSize: btcPerp.tick_size > 0 ? btcPerp.tick_size : FALLBACK_TICK_SIZE,
        };
    } finally {
        await ws_transport.disconnect();
    }
}

async function main() {
    console.log("--------------------------------\nAggressive BTC-PERP quoting strategy\n");
    console.log(`Market: ${SYMBOL}`);
    console.log("Mode: aggressive quoting (can take liquidity when signal is strong)");

    const { instrumentId, tickSize } = await resolveBtcPerpInstrument();
    console.log(`Instrument id: ${instrumentId}, tick size: ${tickSize}`);

    const { exchange, ws_transport: tradingWsTransport } = setupTradingClient();
    const { subscriptions, ws_transport: subscriptionWsTransport } = setupSubscriptionClient();

    const activeSubscriptions: Array<{ unsubscribe: () => Promise<void> }> = [];
    const recentTrades: TradePoint[] = [];
    let latestBbo: BboState | null = null;

    try {
        console.log("Waiting for subscription websocket connection...");
        await waitForWebSocketSetup(subscriptionWsTransport, "Subscription");
        console.log("Subscription websocket connected.");

        console.log("Subscribing to BBO...");
        const bboSubscription = await subscriptions.bbo({ symbol: SYMBOL }, (event) => {
            const bbo = parseBbo(event.detail);
            if (bbo) {
                latestBbo = bbo;
            }
        });
        activeSubscriptions.push(bboSubscription);

        console.log("Subscribing to trades...");
        const tradesSubscription = await subscriptions.trades({ symbol: SYMBOL }, (event) => {
            const updates = parseTrades(event.detail);
            if (updates.length === 0) {
                return;
            }

            recentTrades.push(...updates);
            pruneTrades(recentTrades);
        });
        activeSubscriptions.push(tradesSubscription);

        console.log("Waiting for first BBO update...");
        const bboDeadline = Date.now() + 15_000;
        while (!latestBbo && Date.now() < bboDeadline) {
            await sleep(200);
        }

        if (!latestBbo) {
            throw new Error("No BBO update received within 15 seconds.");
        }

        console.log(
            `Starting loop: runtime=${RUNTIME_SECONDS}s, requote every ${REQUOTE_INTERVAL_MS / 1_000}s`,
        );

        const startedAt = Date.now();
        while (Date.now() - startedAt < RUNTIME_SECONDS * 1_000) {
            if (!latestBbo || Date.now() - (latestBbo as BboState).timestamp > BBO_STALE_MS) {
                console.log("Skipping cycle: BBO is stale.");
                await sleep(REQUOTE_INTERVAL_MS);
                continue;
            }

            pruneTrades(recentTrades);
            const signal = buildFlowSignal(recentTrades);
            const quote = buildQuoteOrders(instrumentId, tickSize, latestBbo, signal);

            try {
                await exchange.cancelByInstrument({
                    instrumentId,
                    expiresAfter: msFromNow(1),
                });
            } catch (error) {
                console.warn("cancelByInstrument warning (continuing):", error);
            }

            try {
                await exchange.placeOrder({
                    orders: quote.orders,
                    expiresAfter: msFromNow(1),
                });

                console.log(
                    `[agg-quote] bid=${quote.bidPrice} ask=${quote.askPrice} size=${quote.size.toFixed(
                        SIZE_DECIMALS,
                    )} pressure=${signal.pressure.toFixed(2)} flow=${signal.total.toFixed(4)}`,
                );
            } catch (error) {
                console.warn("placeOrder warning (continuing):", error);
            }

            await sleep(REQUOTE_INTERVAL_MS);
        }
    } finally {
        console.log("Stopping strategy and cleaning up...");

        try {
            await exchange.cancelByInstrument({
                instrumentId,
                expiresAfter: msFromNow(1),
            });
        } catch (error) {
            console.warn("Final cancelByInstrument warning:", error);
        }

        await cleanupSubscriptions(activeSubscriptions, subscriptionWsTransport);
        await tradingWsTransport.disconnect();
    }
}

main().catch((error) => {
    console.error(error);
});
