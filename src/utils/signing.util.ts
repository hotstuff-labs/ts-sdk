import { encode } from "@msgpack/msgpack";
import { keccak256, zeroAddress, zeroHash } from "viem";

export async function signAction(
  args: {
    wallet: any;
    action: unknown;
    txType: number;
  },
  options?: {
    isTestnet: boolean;
  }
) {
  const isTestnet = options?.isTestnet ?? false;

  const actionBytes = encode(args.action);

  const payloadHash = keccak256(actionBytes);

  // Keep the zero verifying contract explicit for wallet typed-data signing.
  const domain = {
    name: "HotstuffCore",
    version: "1",
    chainId: 1,
    verifyingContract: zeroAddress,
  };

  const types = {
    Action: [
      { name: "source", type: "string" },
      { name: "hash", type: "bytes32" },
      { name: "txType", type: "uint16" },
      { name: "scheme", type: "uint8" },
      { name: "subject", type: "bytes32" },
    ],
  };

  const eip712Message = {
    source: isTestnet ? "Testnet" : "Mainnet",
    hash: payloadHash,
    txType: args.txType,
    scheme: 1, // AuthSchemeSecp256k1
    subject: zeroHash, // The signing key is the account for secp256k1.
  };

  const signature = await args.wallet.signTypedData({
    domain,
    types,
    primaryType: "Action",
    message: eip712Message,
  });

  return signature;
}
