import { msFromNow, printJson, setupTradingClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nCancel by instrument\n");
    const { exchange } = setupTradingClient();

    const result = await exchange.cancelByInstrument({
        instrumentId: 1,
        expiresAfter: msFromNow(60),
    });

    printJson("Orders cancelled by instrument successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
