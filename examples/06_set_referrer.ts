import { printJson, setupExchangeClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nSet referrer\n");
    const { exchange } = setupExchangeClient();

    const result = await exchange.setReferrer({
        code: "TS_SDK_DEMO_REFERRER",
    });

    printJson("Referrer set successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
