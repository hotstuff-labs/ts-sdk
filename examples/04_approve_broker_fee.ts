import { printJson, setupExchangeClient } from "./example_utils.ts";
import { CREDENTIALS } from "./credentials.ts";

async function main() {
    console.log("--------------------------------\nApprove broker fee\n");
    const { exchange } = setupExchangeClient({ isTestnet: false });

    const result = await exchange.approveBrokerFee({
        broker: CREDENTIALS.BROKER_ADDRESS,
        maxFeeRate: "0.01",
    });

    printJson("Broker fee approved successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
