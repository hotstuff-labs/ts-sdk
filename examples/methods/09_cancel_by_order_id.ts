import { msFromNow, printJson, setupTradingClient } from "../utils/example_utils";

async function main() {
    console.log("--------------------------------\nCancel by order id\n");
    const { exchange } = setupTradingClient();

    const result = await exchange.cancelByOid({
        cancels: [{ oid: 1, instrumentId: 1 }],
        expiresAfter: msFromNow(60),
    });

    printJson("Order cancelled successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
