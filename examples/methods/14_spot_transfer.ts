import {
    printJson,
    setupExchangeClient,
} from "../utils/example_utils";
import { ADDRESSES } from "../utils/config";

async function main() {
    console.log("--------------------------------\nSpot balance transfer request\n");
    const { exchange } = setupExchangeClient();

    const result = await exchange.accountSpotBalanceTransferRequest({
        collateralId: 1,
        amount: "100.0",
        destination: ADDRESSES.DESTINATION_ADDRESS,
    });

    printJson(
        "Spot balance transfer request submitted successfully! Response:",
        result,
    );
}

main().catch((error) => {
    console.error(error);
});
