import {
    VAULT_ADDRESS,
    printJson,
    setupExchangeClient,
} from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nVault withdraw request\n");
    const { exchange } = setupExchangeClient({
        isTestnet: true,
    });

    const result = await exchange.redeemFromVault({
        vaultAddress: VAULT_ADDRESS,
        shares: "1",
    });

    printJson("Vault withdraw submitted successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
