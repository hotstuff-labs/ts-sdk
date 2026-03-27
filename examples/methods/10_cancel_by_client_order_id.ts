import { msFromNow, printJson, setupTradingClient } from "../utils/example_utils";

async function main() {
    console.log("--------------------------------\nCancel by client order id\n");
    const { exchange } = setupTradingClient();

    const result = await exchange.cancelByCloid({
        cancels: [{ cloid: "ts-order-1", instrumentId: 1 }],
        expiresAfter: msFromNow(60),
    });

    printJson("Client order cancelled successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
