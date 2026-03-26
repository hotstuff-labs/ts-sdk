import { msFromNow, printJson, setupTradingClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nCancel by order id\n");
    const { exchange } = setupTradingClient({ isTestnet: true });

    const result = await exchange.cancelByOid({
        cancels: [{ oid: 1, instrumentId: 1 }],
        expiresAfter: msFromNow(60),
    });

    printJson("Order cancelled successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
