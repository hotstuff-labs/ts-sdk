# Hotstuff TypeScript SDK

[![npm version](https://img.shields.io/npm/v/@hotstuff-labs/ts-sdk.svg)](https://www.npmjs.com/package/@hotstuff-labs/ts-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

TypeScript SDK for interacting with Hotstuff APIs over HTTP and WebSocket.

## Installation

```bash
npm install @hotstuff-labs/ts-sdk
```

```bash
yarn add @hotstuff-labs/ts-sdk
```

```bash
pnpm add @hotstuff-labs/ts-sdk
```

## Quick Start

```ts
import {
  HttpTransport,
  WebSocketTransport,
  InfoClient,
  ExchangeClient,
  SubscriptionClient,
} from "@hotstuff-labs/ts-sdk";
import { createWalletClient, http } from "viem";
import { mainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const httpTransport = new HttpTransport({ isTestnet: true });
const wsTransport = new WebSocketTransport({ isTestnet: true });

const info = new InfoClient({ transport: httpTransport });
const ticker = await info.ticker({ symbol: "BTC-PERP" });
console.log("Ticker:", ticker);

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const wallet = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
});
const exchange = new ExchangeClient({ transport: httpTransport, wallet });

await exchange.cancelAll({ expiresAfter: Date.now() + 60_000 });

const subscriptions = new SubscriptionClient({ transport: wsTransport });
const sub = await subscriptions.ticker({ symbol: "BTC-PERP" }, (event) => {
  console.log("Live ticker:", event.detail);
});

await sub.unsubscribe();
```

## API Clients

### InfoClient

Read-only data from `info` and `explorer` endpoints.

Methods:

- Global: `oracle`, `supportedCollateral`, `instruments`, `ticker`, `orderbook`, `trades`, `mids`, `bbo`, `chart`
- Account: `accountHistory`, `accountInfo`, `accountSummary`, `openOrders`, `positions`, `orderHistory`, `fills`, `fundingHistory`, `transferHistory`, `instrumentLeverage`, `allAgents`, `brokersCheck`, `referralSummary`, `userFeeInfo`
- Vault: `vaults`, `subVaults`, `vaultBalances`
- Explorer: `blocks`, `blockDetails`, `transactions`, `transactionDetails`

Examples:

```ts
const user = "0x1234..." as `0x${string}`;

await info.supportedCollateral({ symbol: "USDC" });
await info.instruments({ type: "all" });
await info.orderbook({ symbol: "BTC-PERP", depth: 20 });
await info.fills({ user, page: 1, limit: 50 });
await info.blocks({ offset: 0, limit: 10 });
await info.transactionDetails({ tx_hash: "0xabc..." });
await info.subVaults({ vault_address: "0xvault..." as `0x${string}` });
```

All methods accept optional `AbortSignal` as the second argument.

### ExchangeClient

Signed account/trading actions. Requires a `wallet` (compatible with `signTypedData`).

Methods:

- Account: `addAgent`, `revokeAgent`, `updatePerpInstrumentLeverage`, `approveBrokerFee`, `createReferralCode`, `setReferrer`, `claimReferralRewards`
- Trading: `placeOrder`, `cancelByOid`, `cancelByCloid`, `cancelByInstrument`, `cancelAll`
- Collateral: `accountSpotWithdrawRequest`, `accountDerivativeWithdrawRequest`, `accountSpotBalanceTransferRequest`, `accountDerivativeBalanceTransferRequest`, `accountInternalBalanceTransferRequest`
- Vault: `depositToVault`, `redeemFromVault`

Examples:

```ts
await exchange.placeOrder({
  orders: [
    {
      instrumentId: 1,
      side: "b",
      positionSide: "BOTH",
      price: "50000",
      size: "0.1",
      tif: "GTC",
      ro: false,
      po: false,
      cloid: `my-order-${Date.now()}`,
    },
  ],
  expiresAfter: Date.now() + 60_000,
});

await exchange.cancelByCloid({
  cancels: [{ cloid: "my-order-1", instrumentId: 1 }],
  expiresAfter: Date.now() + 60_000,
});

await exchange.accountInternalBalanceTransferRequest({
  collateralId: 1,
  amount: "25.0",
  toDerivativesAccount: true,
});
```

### SubscriptionClient

Real-time subscriptions over WebSocket.

Methods:

- Market: `ticker`, `orderbook`, `trades`, `mids`, `bbo`, `index`, `chart`
- Account: `accountSummary`, `orders`, `positions`, `fills`, `fundingPayments`, `agents`
- Explorer: `blocks`, `transactions`

Examples:

```ts
const user = "0x1234..." as `0x${string}`;

const tradesSub = await subscriptions.trades(
  { symbol: "BTC-PERP" },
  (event) => {
    console.log("Trades:", event.detail);
  },
);

const ordersSub = await subscriptions.orders({ user }, (event) => {
  console.log("Orders:", event.detail);
});

const chartSub = await subscriptions.chart(
  {
    instrument_id: "BTC-PERP",
    chart_type: "mark",
    resolution: "1",
  },
  (event) => console.log("Chart:", event.detail),
);

await Promise.all([
  tradesSub.unsubscribe(),
  ordersSub.unsubscribe(),
  chartSub.unsubscribe(),
]);
```

## Transports

### HttpTransport

```ts
import { HttpTransport } from "@hotstuff-labs/ts-sdk";

const transport = new HttpTransport({
  isTestnet: true,
  timeout: 5000,
  server: {
    mainnet: {
      api: "https://api.hotstuff.trade/",
      rpc: "https://api.hotstuff.trade/",
    },
    testnet: {
      api: "https://testnet-test-api.hotstuff.exchange/",
      rpc: "https://testnet-test-api.hotstuff.exchange/",
    },
  },
});
```

Default endpoints:

- Mainnet API/RPC: `https://api.hotstuff.trade/`
- Testnet API/RPC: `https://testnet-test-api.hotstuff.exchange/`

### WebSocketTransport

```ts
import { WebSocketTransport } from "@hotstuff-labs/ts-sdk";

const ws = new WebSocketTransport({
  isTestnet: true,
  timeout: 15000,
  server: {
    mainnet: "wss://api.hotstuff.trade/ws/",
    testnet: "wss://testnet-test-api.hotstuff.exchange/ws/",
  },
  keepAlive: {
    interval: 30000,
    timeout: 10000,
  },
  autoConnect: true,
});

if (!ws.isConnected()) {
  await ws.connect();
}
```

Default endpoints:

- Mainnet WS: `wss://api.hotstuff.trade/ws/`
- Testnet WS: `wss://testnet-test-api.hotstuff.exchange/ws/`

## Exported Types

The package exports namespaces for transport/client method types:

```ts
import type { TransportsTypes, ClientsTypes } from "@hotstuff-labs/ts-sdk";

type HttpOptions = TransportsTypes.IHttpTransportOptions;
type InfoClientArgs<T extends TransportsTypes.IRequestTransport> =
  ClientsTypes.IInfoClientParameters<T>;
```

## Error Handling

- HTTP requests throw `Error` for network failures, non-JSON responses, or API error payloads.
- WebSocket operations throw `Error` on timeout, rejected subscriptions, or disconnect issues.

```ts
try {
  await info.ticker({ symbol: "BTC-PERP" });
} catch (error) {
  console.error(error);
}
```
