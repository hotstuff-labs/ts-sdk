import { msFromNow, printJson, setupExchangeClient } from "./example_utils.ts";
import { CREDENTIALS } from "./credentials.ts";

async function main() {
    console.log("--------------------------------\nAdding agent\n");
    const { exchange, account: mainAccount } = setupExchangeClient({ isTestnet: true });

    const result = await exchange.addAgent({
        agentName: "ts-sdk-demo-agent",
        agent: CREDENTIALS.AGENT_ADDRESS,
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
