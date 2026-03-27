import { printJson, setupExchangeClient } from "./example_utils.ts";
import { ADDRESSES } from "./config.ts";

async function main() {
    console.log("--------------------------------\nRevoking agent\n");
    const { exchange } = setupExchangeClient();

    const result = await exchange.revokeAgent({
        agent: ADDRESSES.AGENT_ADDRESS,
        forAccount: "",
    });

    printJson("Agent revoked successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
