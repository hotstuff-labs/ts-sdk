import {
    printJson,
    setupExchangeClient,
} from "../utils/example_utils";
import { ADDRESSES } from "../utils/config";

async function main() {
    console.log("--------------------------------\nVault deposit request\n");
    const { exchange } = setupExchangeClient();

    const result = await exchange.depositToVault({
        vaultAddress: ADDRESSES.VAULT_ADDRESS,
        amount: "100.0",
    });

    printJson("Vault deposit submitted successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
