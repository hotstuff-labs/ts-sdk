import { MAIN_ACCOUNT_ADDRESS, printJson, setupInfoClient, VAULT_ADDRESS } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nVault data\n");
    const { info } = setupInfoClient({ isTestnet: true });

    console.log("Fetching vaults...");
    const vaults = await info.vaults({});
    printJson("Vaults:", vaults);

    console.log("Fetching sub vaults...");
    const subVaults = await info.subVaults({
        vault_address: VAULT_ADDRESS,
    });
    printJson("Sub vaults:", subVaults);

    console.log("Fetching vault balances...");
    const vaultBalances = await info.vaultBalances({
        vault_address: VAULT_ADDRESS,
        user: MAIN_ACCOUNT_ADDRESS,
    });
    printJson("Vault balances:", vaultBalances);
}

main().catch((error) => {
    console.error(error);
});
