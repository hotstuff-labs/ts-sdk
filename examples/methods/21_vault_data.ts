import { printJson, setupInfoClient } from "../utils/example_utils";
import { ADDRESSES } from "../utils/config";

async function main() {
    console.log("--------------------------------\nVault data\n");
    const { info } = setupInfoClient();

    console.log("Fetching vaults...");
    const vaults = await info.vaults({});
    printJson("Vaults:", vaults);

    console.log("Fetching sub vaults...");
    const subVaults = await info.subVaults({
        vault_address: ADDRESSES.VAULT_ADDRESS,
    });
    printJson("Sub vaults:", subVaults);

    console.log("Fetching vault balances...");
    const vaultBalances = await info.vaultBalances({
        vault_address: ADDRESSES.VAULT_ADDRESS,
        user: ADDRESSES.MAIN_ACCOUNT_ADDRESS,
    });
    printJson("Vault balances:", vaultBalances);
}

main().catch((error) => {
    console.error(error);
});
