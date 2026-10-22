import assert from "node:assert/strict";
import test from "node:test";
import { createWalletClient, custom, hashTypedData, recoverTypedDataAddress, zeroAddress, zeroHash } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { signAction } from "../src/utils/signing.util.ts";

// Matches core's AgentSignature serialization and TestGetAuthHashSDKVectors.
const action = {
  signer: "0x1111111111111111111111111111111111111111",
  nonce: 1700000000000,
};
const account = privateKeyToAccount(`0x${"01".repeat(32)}`);

for (const [isTestnet, expected] of [
  [false, "0x021c709d47671ea984122e5eabccb53c3c59717382363d8a82de03fbb2d21d6e"],
  [true, "0x95da5eff3b2ea548553ac0ae4e5184df4c6e8457cd66a0976e13926dc0101196"],
] as const) {
  test(`signAction matches core on ${isTestnet ? "testnet" : "mainnet"}`, async () => {
    let typedData: any;
    const signature = await signAction({
      wallet: {
        signTypedData: (data: any) => {
          typedData = data;
          return account.signTypedData(data);
        },
      },
      action,
      txType: 1,
    }, { isTestnet });
    assert.equal(typedData.domain.verifyingContract, zeroAddress);
    assert.equal(typedData.message.scheme, 1);
    assert.equal(typedData.message.subject, zeroHash);
    assert.deepEqual(typedData.types.Action, [
      { name: "source", type: "string" },
      { name: "hash", type: "bytes32" },
      { name: "txType", type: "uint16" },
      { name: "scheme", type: "uint8" },
      { name: "subject", type: "bytes32" },
    ]);
    assert.equal(hashTypedData(typedData), expected);
    assert.equal(await recoverTypedDataAddress({ ...typedData, signature }), account.address);
    for (const change of [
      { scheme: 2 },
      { subject: `0x${"11".repeat(32)}` },
      { source: isTestnet ? "Mainnet" : "Testnet" },
      { txType: 2 },
      { hash: zeroHash },
    ]) {
      const altered = { ...typedData, message: { ...typedData.message, ...change } };
      assert.notEqual(hashTypedData(altered), expected);
      assert.notEqual(await recoverTypedDataAddress({ ...altered, signature }), account.address);
    }
    const socialDigest = hashTypedData({ ...typedData, message: {
      ...typedData.message, scheme: 2, subject: `0x${"11".repeat(32)}`,
    } });
    assert.equal(socialDigest, isTestnet
      ? "0x3375e82d51602281d316873a66ec0a476c1d9121655457290b63cef1931d4e60"
      : "0xb93db5ff2db505edd75eb6071b6e57296ff80575aed11c08f14cd2a6eb91a623");
  });
}

test("signAction defaults to mainnet", async () => {
  let digest: string | undefined;
  const result = await signAction({
    wallet: { signTypedData: async (data: any) => { digest = hashTypedData(data); return "signature"; } },
    action,
    txType: 1,
  });
  assert.equal(digest, "0x021c709d47671ea984122e5eabccb53c3c59717382363d8a82de03fbb2d21d6e");
  assert.equal(result, "signature");
});

test("wallet RPC includes the complete EIP-712 domain and action fields", async () => {
  let rpcData: any;
  const wallet = createWalletClient({
    account: account.address,
    transport: custom({
      request: async ({ method, params }: any) => {
        assert.equal(method, "eth_signTypedData_v4");
        assert.equal(params[0].toLowerCase(), account.address.toLowerCase());
        rpcData = JSON.parse(params[1]);
        return account.signTypedData(rpcData);
      },
    }),
  });
  const signature = await signAction({ wallet, action, txType: 1 });
  assert.deepEqual(rpcData.types.EIP712Domain, [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ]);
  assert.equal(rpcData.domain.verifyingContract, zeroAddress);
  assert.equal(rpcData.message.scheme, 1);
  assert.equal(rpcData.message.subject, zeroHash);
  assert.equal(hashTypedData(rpcData), "0x021c709d47671ea984122e5eabccb53c3c59717382363d8a82de03fbb2d21d6e");
  assert.equal(await recoverTypedDataAddress({ ...rpcData, signature }), account.address);
});
