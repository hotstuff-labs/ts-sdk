import { AGENT_ADDRESS, printJson, setupExchangeClient } from "./example_utils.ts";

async function main() {
    console.log("--------------------------------\nRevoking agent\n");
    const { exchange } = setupExchangeClient({ isTestnet: true });

    const result = await exchange.revokeAgent({
        agent: AGENT_ADDRESS,
        forAccount: "",
    });

    printJson("Agent revoked successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
