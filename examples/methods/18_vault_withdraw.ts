import {
    printJson,
    setupExchangeClient,
} from "../utils/example_utils";
import { ADDRESSES } from "../utils/config";

async function main() {
    console.log("--------------------------------\nVault withdraw request\n");
    const { exchange } = setupExchangeClient();

    const result = await exchange.redeemFromVault({
        vaultAddress: ADDRESSES.VAULT_ADDRESS,
        shares: "1",
    });

    printJson("Vault withdraw submitted successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
