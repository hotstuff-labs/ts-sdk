import { printJson, setupExchangeClient } from "../utils/example_utils";

async function main() {
    console.log("--------------------------------\nCreate referral code\n");
    const { exchange } = setupExchangeClient();

    const result = await exchange.createReferralCode({
        code: "1234567890",
    });

    printJson("Referral code created successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
