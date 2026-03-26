import { BROKER_ADDRESS, printJson, setupExchangeClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nApprove broker fee\n");
    const { exchange } = setupExchangeClient({ isTestnet: true });

    const result = await exchange.approveBrokerFee({
        broker: BROKER_ADDRESS,
        maxFeeRate: "0.01",
    });

    printJson("Broker fee approved successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
