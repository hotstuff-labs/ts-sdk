import {
    buildListener,
    cleanupSubscriptions,
    setupSubscriptionClient,
    waitForUpdates,
} from "../utils/example_utils";


async function main() {
    console.log("--------------------------------\nGlobal subscriptions\n");
    const { subscriptions, ws_transport } = setupSubscriptionClient();
    const activeSubscriptions: Array<{ unsubscribe: () => Promise<void> }> = [];

    try {
        console.log("Subscribing to ticker...");
        const tickerSubscription = await subscriptions.ticker(
            { symbol: "BTC-PERP" },
            buildListener("ticker"),
        );
        activeSubscriptions.push(tickerSubscription);

        console.log("Subscribing to orderbook...");
        const orderbookSubscription = await subscriptions.orderbook(
            { symbol: "BTC-PERP" },
            buildListener("orderbook"),
        );
        activeSubscriptions.push(orderbookSubscription);

        console.log("Subscribing to trades...");
        const tradesSubscription = await subscriptions.trades(
            { symbol: "BTC-PERP" },
            buildListener("trades"),
        );
        activeSubscriptions.push(tradesSubscription);

        console.log("Subscribing to index...");
        const indexSubscription = await subscriptions.index(buildListener("index"));
        activeSubscriptions.push(indexSubscription);

        console.log("Subscribing to mids...");
        const midsSubscription = await subscriptions.mids({ symbol: "BTC-PERP" }, buildListener("mids"));
        activeSubscriptions.push(midsSubscription);

        console.log("Subscribing to BBO...");
        const bboSubscription = await subscriptions.bbo({ symbol: "BTC-PERP" }, buildListener("bbo"));
        activeSubscriptions.push(bboSubscription);

        console.log("Subscribing to chart...");
        const chartSubscription = await subscriptions.chart(
            { instrument_id: 1, resolution: "5", chart_type: "mark" },
            buildListener("chart"),
        );
        activeSubscriptions.push(chartSubscription);

        await waitForUpdates(20);
    } finally {
        console.log("Cleaning up subscriptions...");
        await cleanupSubscriptions(activeSubscriptions, ws_transport);
    }
}

main().catch((error) => {
    console.error(error);
});
