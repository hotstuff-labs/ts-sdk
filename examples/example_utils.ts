import { privateKeyToAccount } from "viem/accounts";
import { CREDENTIALS, CONFIG } from "./config.ts";
import {
    ExchangeClient,
    HttpTransport,
    InfoClient,
    SubscriptionClient,
    WebSocketTransport,
} from "../src/index.ts";




type SubscriptionResult = { unsubscribe: () => Promise<void> };


export function msFromNow(minutes = 60): number {
    return Date.now() + minutes * 60_000;
}

export function setupInfoClient() {
    const http_transport = new HttpTransport({ isTestnet: CONFIG.IS_TESTNET, });
    const ws_transport = new WebSocketTransport({ isTestnet: CONFIG.IS_TESTNET, autoConnect: true });
    const info = new InfoClient({ transport: CONFIG.IS_WEBSOCKET ? ws_transport : http_transport });
    return { info, http_transport, ws_transport };
}

export function setupExchangeClient() {
    const http_transport = new HttpTransport({ isTestnet: CONFIG.IS_TESTNET });
    const ws_transport = new WebSocketTransport({ isTestnet: CONFIG.IS_TESTNET, autoConnect: true });
    const account = privateKeyToAccount(CREDENTIALS.MAIN_ACCOUNT_PRIVATE_KEY);

    const exchange = new ExchangeClient({
        transport: CONFIG.IS_WEBSOCKET ? ws_transport : http_transport,
        wallet: account,
    });

    return { exchange, http_transport, ws_transport, account };
}

export function setupTradingClient() {
    const http_transport = new HttpTransport({ isTestnet: CONFIG.IS_TESTNET });
    const ws_transport = new WebSocketTransport({ isTestnet: CONFIG.IS_TESTNET, autoConnect: true });
    const account = privateKeyToAccount(CREDENTIALS.AGENT_PRIVATE_KEY);

    const exchange = new ExchangeClient({
        transport: CONFIG.IS_WEBSOCKET ? ws_transport : http_transport,
        wallet: account,
    });

    return { exchange, http_transport, ws_transport, account };
}

export function setupSubscriptionClient() {
    const ws_transport = new WebSocketTransport({ isTestnet: CONFIG.IS_TESTNET, autoConnect: true });
    const subscriptions = new SubscriptionClient({ transport: ws_transport });
    return { subscriptions, ws_transport };
}

export function buildListener(channelName: string) {
    return (event: CustomEvent<unknown>) => {
        console.log(`[${channelName}]`, JSON.stringify(event.detail, null, 2));
    };
}

export async function waitForUpdates(seconds = 20): Promise<void> {
    console.log(`Listening for ${seconds}s. Press Ctrl+C to stop early.`);
    await new Promise((resolve) => setTimeout(resolve, seconds * 1_000));
}

export async function cleanupSubscriptions(
    activeSubscriptions: SubscriptionResult[],
    transport: WebSocketTransport,
): Promise<void> {
    for (const subscription of activeSubscriptions) {
        try {
            await subscription.unsubscribe();
        } catch (error) {
            console.warn("[examples] Failed to unsubscribe cleanly:", error);
        }
    }

    await transport.disconnect();
}

export function printJson(label: string, value: unknown): void {
    console.log(`${label}\n${JSON.stringify(value, null, 2)}\n`);
}
