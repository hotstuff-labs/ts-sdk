import {
    printJson,
    setupExchangeClient,
} from "./example_utils.ts";
import { ADDRESSES } from "./config.ts";

async function main() {
    console.log(
        "--------------------------------\nDerivative balance transfer request\n",
    );
    const { exchange } = setupExchangeClient();

    const result = await exchange.accountDerivativeBalanceTransferRequest({
        collateralId: 1,
        amount: "100.0",
        destination: ADDRESSES.DESTINATION_ADDRESS,
    });

    printJson(
        "Derivative balance transfer request submitted successfully! Response:",
        result,
    );
}

main().catch((error) => {
    console.error(error);
});
