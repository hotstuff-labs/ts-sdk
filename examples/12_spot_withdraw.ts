import { printJson, setupTradingClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nSpot withdraw request\n");
    const { exchange } = setupTradingClient();

    const result = await exchange.accountSpotWithdrawRequest({
        collateralId: 1,
        amount: "100.0",
        chainId: 11155111,
    });

    printJson("Spot withdraw request submitted successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
