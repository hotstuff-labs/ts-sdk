import { printJson, setupExchangeClient } from "../utils/example_utils";

async function main() {
    console.log("--------------------------------\nClaim referral rewards\n");
    const { exchange } = setupExchangeClient();

    const result = await exchange.claimReferralRewards({
        collateralId: 1,
        spot: true,
    });

    printJson("Referral rewards claimed successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
