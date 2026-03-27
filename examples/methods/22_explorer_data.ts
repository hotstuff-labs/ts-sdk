import { printJson, setupInfoClient } from "../utils/example_utils";

const BLOCK_HEIGHT = 162778;
const TRANSACTION_HASH =
    "0x4cb07520655fd427da1574a0ac819b8d60e214b3e3a21fcbd07eee2f90b33029";

async function main() {
    console.log("--------------------------------\nExplorer data\n");
    const { info } = setupInfoClient();

    console.log("Fetching blocks...");
    const blocks = await info.blocks({ limit: 10, offset: 0 });
    printJson("Blocks:", blocks);

    console.log("Fetching block details...");
    const blockDetails = await info.blockDetails({ block_height: BLOCK_HEIGHT });
    printJson("Block details:", blockDetails);

    console.log("Fetching transactions...");
    const transactions = await info.transactions({ limit: 10, offset: 0 });
    printJson("Transactions:", transactions);

    console.log("Fetching transaction details...");
    const transactionDetails = await info.transactionDetails({
        tx_hash: TRANSACTION_HASH,
    });
    printJson("Transaction details:", transactionDetails);
}

main().catch((error) => {
    console.error(error);
});
