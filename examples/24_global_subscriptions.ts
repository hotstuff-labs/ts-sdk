import {
    buildListener,
    cleanupSubscriptions,
    setupSubscriptionClient,
    waitForUpdates,
} from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nGlobal subscriptions\n");
    const { subscriptions, transport } = setupSubscriptionClient({ isTestnet: true });
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

        await waitForUpdates(20);
    } finally {
        console.log("Cleaning up subscriptions...");
        await cleanupSubscriptions(activeSubscriptions, transport);
    }
}

main().catch((error) => {
    console.error(error);
});
