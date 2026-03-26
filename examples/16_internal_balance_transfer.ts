import { printJson, setupExchangeClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nInternal balance transfer request\n");
    const { exchange } = setupExchangeClient({
        isTestnet: true
    });

    const result = await exchange.accountInternalBalanceTransferRequest({
        collateralId: 1,
        amount: "100.0",
        toDerivativesAccount: false,
    });

    printJson(
        "Internal balance transfer request submitted successfully! Response:",
        result,
    );
}

main().catch((error) => {
    console.error(error);
});
