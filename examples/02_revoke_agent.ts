import { printJson, setupExchangeClient } from "./example_utils.ts";
import { CREDENTIALS } from "./credentials.ts";

async function main() {
    console.log("--------------------------------\nRevoking agent\n");
    const { exchange } = setupExchangeClient({ isTestnet: true });

    const result = await exchange.revokeAgent({
        agent: CREDENTIALS.AGENT_ADDRESS,
        forAccount: "",
    });

    printJson("Agent revoked successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
