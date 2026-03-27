import { printJson, setupExchangeClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nDerivative withdraw request\n");
    const { exchange } = setupExchangeClient();

    const result = await exchange.accountDerivativeWithdrawRequest({
        collateralId: 1,
        amount: "100.0",
        chainId: 11155111,
    });

    printJson(
        "Derivative withdraw request submitted successfully! Response:",
        result,
    );
}

main().catch((error) => {
    console.error(error);
});
