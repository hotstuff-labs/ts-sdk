import {
    buildListener,
    cleanupSubscriptions,
    setupSubscriptionClient,
    waitForUpdates,
} from "../utils/example_utils";
import { ADDRESSES } from "../utils/config";

async function main() {
    console.log("--------------------------------\nAccount subscriptions\n");
    const userAddress = ADDRESSES.MAIN_ACCOUNT_ADDRESS;
    const { subscriptions, ws_transport } = setupSubscriptionClient();
    const activeSubscriptions: Array<{ unsubscribe: () => Promise<void> }> = [];

    try {
        console.log(`Using user address: ${userAddress}\n`);

        console.log("Subscribing to account summary...");
        const accountSummarySubscription = await subscriptions.accountSummary(
            { user: userAddress },
            buildListener("account_summary"),
        );
        activeSubscriptions.push(accountSummarySubscription);

        console.log("Subscribing to positions...");
        const positionsSubscription = await subscriptions.positions(
            { address: userAddress },
            buildListener("positions"),
        );
        activeSubscriptions.push(positionsSubscription);

        console.log("Subscribing to orders...");
        const ordersSubscription = await subscriptions.orders(
            { user: userAddress },
            buildListener("orders"),
        );
        activeSubscriptions.push(ordersSubscription);

        console.log("Subscribing to funding payments...");
        const fundingSubscription = await subscriptions.fundingPayments(
            { user: userAddress },
            buildListener("funding_payments"),
        );
        activeSubscriptions.push(fundingSubscription);

        console.log("Subscribing to agents...");
        const agentsSubscription = await subscriptions.agents(
            { user: userAddress },
            buildListener("agents"),
        );
        activeSubscriptions.push(agentsSubscription);

        await waitForUpdates(20);
    } finally {
        console.log("Cleaning up subscriptions...");
        await cleanupSubscriptions(activeSubscriptions, ws_transport);
    }
}

main().catch((error) => {
    console.error(error);
});
