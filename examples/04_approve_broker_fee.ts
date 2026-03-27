import { printJson, setupExchangeClient } from "./example_utils.ts";
import { ADDRESSES } from "./config.ts";

async function main() {
    console.log("--------------------------------\nApprove broker fee\n");
    const { exchange } = setupExchangeClient();

    const result = await exchange.approveBrokerFee({
        broker: ADDRESSES.BROKER_ADDRESS,
        maxFeeRate: "0.01",
    });

    printJson("Broker fee approved successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
