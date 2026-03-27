import { printJson, setupInfoClient } from "./example_utils.ts";
import { ADDRESSES } from "./config.ts";

async function main() {
    console.log("--------------------------------\nAccount trading data\n");
    const { info } = setupInfoClient();
    const user = ADDRESSES.MAIN_ACCOUNT_ADDRESS;

    console.log("Fetching open orders...");
    const openOrders = await info.openOrders({ user });
    printJson("Open orders:", openOrders);

    console.log("Fetching positions...");
    const positions = await info.positions({ user });
    printJson("Positions:", positions);

    console.log("Fetching account summary...");
    const accountSummary = await info.accountSummary({ user });
    printJson("Account summary:", accountSummary);

    console.log("Fetching account info...");
    const accountInfo = await info.accountInfo({ user });
    printJson("Account info:", accountInfo);

    console.log("Fetching referral summary...");
    const referralSummary = await info.referralSummary({ user });
    printJson("Referral summary:", referralSummary);

    console.log("Fetching user fee info...");
    const userFeeInfo = await info.userFeeInfo({ user });
    printJson("User fee info:", userFeeInfo);

    console.log("Fetching account history...");
    const accountHistory = await info.accountHistory({ user });
    printJson("Account history:", accountHistory);

    console.log("Fetching order history...");
    const orderHistory = await info.orderHistory({ user });
    printJson("Order history:", orderHistory);

    console.log("Fetching fills...");
    const fills = await info.fills({ user });
    printJson("Fills:", fills);

    console.log("Fetching funding history...");
    const fundingHistory = await info.fundingHistory({ user });
    printJson("Funding history:", fundingHistory);

    console.log("Fetching transfer history...");
    const transferHistory = await info.transferHistory({ user });
    printJson("Transfer history:", transferHistory);

    console.log("Fetching instrument leverage...");
    const instrumentLeverage = await info.instrumentLeverage({
        user,
        symbol: "BTC-PERP",
    });
    printJson("Instrument leverage:", instrumentLeverage);

    console.log("Fetching agents...");
    const agents = await info.allAgents({ user });
    printJson("Agents:", agents);

    console.log("Fetching brokers check...");
    const brokersCheck = await info.brokersCheck({ user });
    printJson("Brokers check:", brokersCheck);
}

main().catch((error) => {
    console.error(error);
});
