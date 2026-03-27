import { printJson, setupInfoClient } from "./example_utils.ts";
import { CREDENTIALS } from "./credentials.ts";

async function main() {
    console.log("--------------------------------\nVault data\n");
    const { info } = setupInfoClient({ isTestnet: true });

    console.log("Fetching vaults...");
    const vaults = await info.vaults({});
    printJson("Vaults:", vaults);

    console.log("Fetching sub vaults...");
    const subVaults = await info.subVaults({
        vault_address: CREDENTIALS.VAULT_ADDRESS,
    });
    printJson("Sub vaults:", subVaults);

    console.log("Fetching vault balances...");
    const vaultBalances = await info.vaultBalances({
        vault_address: CREDENTIALS.VAULT_ADDRESS,
        user: CREDENTIALS.MAIN_ACCOUNT_ADDRESS,
    });
    printJson("Vault balances:", vaultBalances);
}

main().catch((error) => {
    console.error(error);
});
