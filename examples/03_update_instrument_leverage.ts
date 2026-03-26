import { printJson, setupTradingClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nUpdating instrument leverage\n");
    const { exchange } = setupTradingClient({ isTestnet: true });

    const result = await exchange.updatePerpInstrumentLeverage({
        instrumentId: 1,
        leverage: 10,
    });

    printJson("Instrument leverage updated successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
