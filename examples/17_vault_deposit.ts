import {
    printJson,
    setupExchangeClient,
} from "./example_utils.ts";
import { CREDENTIALS } from "./credentials.ts";

async function main() {
    console.log("--------------------------------\nVault deposit request\n");
    const { exchange } = setupExchangeClient({
        isTestnet: true,
    });

    const result = await exchange.depositToVault({
        vaultAddress: CREDENTIALS.VAULT_ADDRESS,
        amount: "100.0",
    });

    printJson("Vault deposit submitted successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
