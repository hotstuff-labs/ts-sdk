import {
    VAULT_ADDRESS,
    printJson,
    setupExchangeClient,
} from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nVault deposit request\n");
    const { exchange } = setupExchangeClient({
        isTestnet: true,
    });

    const result = await exchange.depositToVault({
        vaultAddress: VAULT_ADDRESS,
        amount: "100.0",
    });

    printJson("Vault deposit submitted successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
