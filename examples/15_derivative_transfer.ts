import {
    DESTINATION_ADDRESS,
    printJson,
    setupExchangeClient,
} from "./example_utils.ts";

async function main() {
    console.log(
        "--------------------------------\nDerivative balance transfer request\n",
    );
    const { exchange } = setupExchangeClient({
        isTestnet: true,
    });

    const result = await exchange.accountDerivativeBalanceTransferRequest({
        collateralId: 1,
        amount: "100.0",
        destination: DESTINATION_ADDRESS,
    });

    printJson(
        "Derivative balance transfer request submitted successfully! Response:",
        result,
    );
}

main().catch((error) => {
    console.error(error);
});
