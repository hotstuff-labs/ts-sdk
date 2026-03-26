import { printJson, setupExchangeClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nClaim referral rewards\n");
    const { exchange } = setupExchangeClient({ isTestnet: true });

    const result = await exchange.claimReferralRewards({
        collateralId: 1,
        spot: true,
    });

    printJson("Referral rewards claimed successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
