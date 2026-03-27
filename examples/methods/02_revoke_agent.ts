import { printJson, setupExchangeClient } from "../utils/example_utils";
import { ADDRESSES } from "../utils/config";

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
