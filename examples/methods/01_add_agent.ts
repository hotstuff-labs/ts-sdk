import { msFromNow, printJson, setupExchangeClient } from "../utils/example_utils";
import { ADDRESSES, CREDENTIALS } from "../utils/config";

async function main() {
    console.log("--------------------------------\nAdding agent\n");
    const { exchange, account: mainAccount } = setupExchangeClient();

    const result = await exchange.addAgent({
        agentName: "ts-sdk-demo-agent",
        agent: ADDRESSES.AGENT_ADDRESS,
        forAccount: "",
        agentPrivateKey: CREDENTIALS.AGENT_PRIVATE_KEY,
        signer: mainAccount.address,
        validUntil: msFromNow(60),
    });

    printJson("Agent added successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
