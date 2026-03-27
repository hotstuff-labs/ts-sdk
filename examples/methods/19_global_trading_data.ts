import { printJson, setupInfoClient } from "../utils/example_utils";

async function main() {
    console.log("--------------------------------\nGlobal trading data\n");
    const { info } = setupInfoClient();

    console.log("Fetching oracle prices...");
    const oracle = await info.oracle({ symbol: "USDT/USDC" });
    printJson("Oracle prices:", oracle);

    console.log("Fetching supported collateral...");
    const supportedCollateral = await info.supportedCollateral({ symbol: "all" });
    printJson("Supported collateral:", supportedCollateral);

    console.log("Fetching instruments...");
    const instruments = await info.instruments({ type: "all" });
    printJson("Instruments:", instruments);

    console.log("Fetching BTC-PERP ticker...");
    const ticker = await info.ticker({ symbol: "BTC-PERP" });
    printJson("Ticker:", ticker);

    console.log("Fetching BTC-PERP orderbook...");
    const orderbook = await info.orderbook({ symbol: "BTC-PERP", depth: 10 });
    printJson("Orderbook:", orderbook);

    console.log("Fetching recent BTC-PERP trades...");
    const trades = await info.trades({ symbol: "BTC-PERP", limit: 5 });
    printJson("Trades:", trades);

    console.log("Fetching mids...");
    const mids = await info.mids({ symbol: "all" });
    printJson("Mids:", mids);

    console.log("Fetching BBO...");
    const bbo = await info.bbo({ symbol: "BTC-PERP" });
    printJson("BBO:", bbo);

    const now = Math.floor(Date.now() / 1000);
    console.log("Fetching chart data...");
    const chart = await info.chart({
        instrument_id: 1,
        chart_type: "mark",
        resolution: "5",
        from: now - 1_000,
        to: now,
    });
    printJson("Chart:", chart);
}

main().catch((error) => {
    console.error(error);
});
