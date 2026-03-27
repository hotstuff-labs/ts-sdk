import { printJson, setupTradingClient } from "../utils/example_utils";


async function main() {
    console.log("--------------------------------\nUpdating instrument leverage\n");
    const { exchange } = setupTradingClient();

    const result = await exchange.updatePerpInstrumentLeverage({
        instrumentId: 1,
        leverage: 10,
    });

    printJson("Instrument leverage updated successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
