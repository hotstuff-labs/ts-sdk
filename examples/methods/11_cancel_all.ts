import { msFromNow, printJson, setupTradingClient } from "../utils/example_utils";

async function main() {
    console.log("--------------------------------\nCancel all orders\n");
    const { exchange } = setupTradingClient();

    const result = await exchange.cancelAll({
        expiresAfter: msFromNow(60),
    });

    printJson("All orders cancelled successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
