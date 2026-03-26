import { msFromNow, printJson, setupTradingClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nCancel all orders\n");
    const { exchange } = setupTradingClient({
        isTestnet: true,
    });

    const result = await exchange.cancelAll({
        expiresAfter: msFromNow(60),
    });

    printJson("All orders cancelled successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
