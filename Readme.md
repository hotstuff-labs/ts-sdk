# Hotstuff Typescript SDK

[![npm version](https://img.shields.io/npm/v/@hotstuff-labs/ts-sdk.svg)](https://www.npmjs.com/package/@hotstuff-labs/ts-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> TypeScript SDK for interacting with Hotstuff Labs decentralized exchange

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Clients](#api-clients)
  - [InfoClient](#infoclient)
  - [ExchangeClient](#exchangeclient)
  - [SubscriptionClient](#subscriptionclient)
- [Transports](#transports)
  - [HttpTransport](#httptransport)
  - [WebSocketTransport](#websockettransport)
- [Advanced Usage](#advanced-usage)
- [Error Handling](#error-handling)
- [Examples](#examples)

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

```typescript
import {
  HttpTransport,
  WebSocketTransport,
  InfoClient,
  ExchangeClient,
  SubscriptionClient,
} from '@hotstuff-labs/ts-sdk';

// Create transports
const httpTransport = new HttpTransport({ isTestnet: true });
const wsTransport = new WebSocketTransport({ isTestnet: true });

// Query market data (read-only)
const info = new InfoClient({ transport: httpTransport });
const ticker = await info.ticker({ symbol: 'BTC-PERP' });
console.log('Current BTC-PERP ticker:', ticker);

// Subscribe to real-time updates
const subscriptions = new SubscriptionClient({ transport: wsTransport });
const sub = await subscriptions.ticker({ symbol: 'BTC-PERP' }, (event) =>
  console.log('Live ticker:', event.detail),
);

// Later: unsubscribe
await sub.unsubscribe();
```

## API Clients

### InfoClient

Query market data, account information, vault details, and blockchain explorer data.

#### Creating an InfoClient

```typescript
import { HttpTransport, InfoClient } from '@hotstuff-labs/ts-sdk';

const transport = new HttpTransport({ isTestnet: true });
const info = new InfoClient({ transport });
```

#### Market Data Methods

```typescript
// Get all instruments (perps, spot)
const instruments = await info.instruments({ type: 'all' }); // 'perps', 'spot', or 'all'

// Get supported collateral
const collateral = await info.supportedCollateral({});

// Get oracle prices for a symbol
const oracle = await info.oracle({ symbol: 'BTC' });

// Get ticker for a specific symbol
const ticker = await info.ticker({ symbol: 'BTC-PERP' });

// Get orderbook with depth
const orderbook = await info.orderbook({ symbol: 'BTC-PERP', depth: 20 });

// Get recent trades
const trades = await info.trades({ symbol: 'BTC-PERP', limit: 50 });

// Get mid prices for all instruments
const mids = await info.mids({});

// Get best bid/offer
const bbo = await info.bbo({ symbol: 'BTC-PERP' });

// Get chart data
const chart = await info.chart({
  symbol: 'BTC-PERP',
  resolution: '60', // '1', '5', '15', '60', '240', '1D', '1W'
  chart_type: 'mark', // 'mark', 'ltp', 'index'
  from: Date.now() - 86400, // start timestamp
  to: Date.now(), // end timestamp
});
```

#### Account Methods

```typescript
const userAddress = '0x1234...';

// Get account summary
const summary = await info.accountSummary({ user: userAddress });

// Get account info (with optional collateral ID and history)
const accountInfo = await info.accountInfo({
  user: userAddress,
  collateralID: 1, // optional
  includeHistory: true, // optional
});

// Get open orders (with pagination)
const openOrders = await info.openOrders({
  user: userAddress,
  page: 1, // optional
  limit: 50, // optional
});

// Get current positions
const positions = await info.positions({
  user: userAddress,
  instrument: 'BTC-PERP', // optional: filter by instrument
});

// Get order history
const orderHistory = await info.orderHistory({
  user: userAddress,
  instrumentId: 'BTC-PERP', // optional
  limit: 100, // optional
});

// Get trade history (fills)
const tradeHistory = await info.tradeHistory({
  user: userAddress,
  instrumentId: 'BTC-PERP', // optional
  limit: 50, // optional
});

// Get funding history
const fundingHistory = await info.fundingHistory({ user: userAddress });

// Get transfer history
const transferHistory = await info.transferHistory({
  user: userAddress,
  limit: 50, // optional
});

// Get account history
const accountHistory = await info.accountHistory({ user: userAddress });

// Get user fee information
const feeInfo = await info.userFeeInfo({ user: userAddress });

// Get instrument leverage settings
const leverage = await info.instrumentLeverage({
  user: userAddress,
  symbol: 'BTC-PERP',
});

// Get referral summary
const referralSummary = await info.referralSummary({ user: userAddress });

// Get agents
const agents = await info.agents({ user: userAddress });
```

#### Vault Methods

```typescript
// Get all vaults
const vaults = await info.vaults({});

// Get sub-vaults for a specific vault
const subVaults = await info.subVaults({ vaultId: 1 });

// Get vault balances
const vaultBalances = await info.vaultBalances({ vaultId: 1 });
```

#### Explorer Methods

```typescript
// Get recent blocks
const blocks = await info.blocks({ limit: 10 });

// Get specific block details
const blockDetails = await info.blockDetails({ blockNumber: 12345 });

// Get recent transactions
const transactions = await info.transactions({ limit: 20 });

// Get specific transaction details
const txDetails = await info.transactionDetails({ txHash: '0xabc...' });
```

#### Abort Signals

All InfoClient methods support AbortSignal for cancellation:

```typescript
const controller = new AbortController();
const promise = info.orderbook({ symbol: 'BTC-PERP', depth: 50 }, controller.signal);

// Cancel the request
controller.abort();
```

---

### ExchangeClient

Execute signed trading actions and account management operations.

#### Creating an ExchangeClient

```typescript
import { HttpTransport, ExchangeClient } from '@hotstuff-labs/ts-sdk';
import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const transport = new HttpTransport({ isTestnet: true });

// Create a viem wallet
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const wallet = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
});

const exchange = new ExchangeClient({ transport, wallet });
```

#### Trading Methods

```typescript
// Place order(s)
await exchange.placeOrder({
  orders: [
    {
      instrumentId: 1,
      side: 'b', // 'b' for buy, 's' for sell
      positionSide: 'BOTH', // 'LONG', 'SHORT', or 'BOTH'
      price: '50000.00',
      size: '0.1',
      tif: 'GTC', // 'GTC', 'IOC', or 'FOK'
      ro: false, // reduce-only
      po: false, // post-only
      cloid: 'my-order-123', // client order ID
      triggerPx: '51000.00', // optional trigger price
      isMarket: false, // optional market order flag
      tpsl: '', // optional: 'tp', 'sl', or ''
      grouping: 'normal', // optional: 'position', 'normal', or ''
    },
  ],
  brokerConfig: {
    // optional broker configuration
    broker: '0x0000000000000000000000000000000000000000',
    fee: '0.001',
  },
  expiresAfter: Date.now() + 3600, // 1 hour from now
});

// Cancel order by order ID
await exchange.cancelByOid({
  cancels: [
    { oid: 123456, instrumentId: 1 },
    { oid: 123457, instrumentId: 1 },
  ],
  expiresAfter: Date.now() + 3600,
});

// Cancel order by client order ID
await exchange.cancelByCloid({
  cancels: [{ cloid: 'my-order-123', instrumentId: 1 }],
  expiresAfter: Date.now() + 3600,
});

// Cancel all orders for a specific instrument
await exchange.cancelByInstrument({
  instrumentId: 1,
  expiresAfter: Date.now() + 3600,
});

// Cancel all orders
await exchange.cancelAll({
  expiresAfter: Date.now() + 3600,
});
```

#### Account Management

```typescript
// Add an agent (requires agent private key)
await exchange.addAgent({
  agentName: 'my-trading-bot',
  agent: '0xagent...',
  forAccount: '',
  agentPrivateKey: '0xprivatekey...',
  signer: '0xsigner...',
  validUntil: Date.now() + 86400, // 24 hours
});

// Revoke an agent
await exchange.revokeAgent({
  agent: '0xagent...',
  forAccount: '', // optional: sub-account address
});

// Update leverage for a perpetual instrument
await exchange.updatePerpInstrumentLeverage({
  instrumentId: 1,
  leverage: 10, // 10x leverage
});

// Approve broker fee
await exchange.approveBrokerFee({
  broker: '0xbroker...',
  maxFeeRate: '0.001', // 0.1% max fee
});

// Create a referral code
await exchange.createReferralCode({
  code: 'MY_REFERRAL_CODE',
});

// Set referrer using a referral code
await exchange.setReferrer({
  code: 'FRIEND_REFERRAL_CODE',
});

// Claim referral rewards
await exchange.claimReferralRewards({
  collateralId: 1,
  spot: true, // true for spot account, false for derivatives
});
```

#### Collateral Transfer Methods

```typescript
// Request spot collateral withdrawal to external chain
await exchange.accountSpotWithdrawRequest({
  collateralId: 1,
  amount: '100.0',
  chainId: 1, // Ethereum mainnet
});

// Request derivative collateral withdrawal to external chain
await exchange.accountDerivativeWithdrawRequest({
  collateralId: 1,
  amount: '100.0',
  chainId: 1,
});

// Transfer spot balance to another address on Hotstuff
await exchange.accountSpotBalanceTransferRequest({
  collateralId: 1,
  amount: '50.0',
  destination: '0xrecipient...',
});

// Transfer derivative balance to another address on Hotstuff
await exchange.accountDerivativeBalanceTransferRequest({
  collateralId: 1,
  amount: '50.0',
  destination: '0xrecipient...',
});

// Transfer balance between spot and derivatives accounts
await exchange.accountInternalBalanceTransferRequest({
  collateralId: 1,
  amount: '25.0',
  toDerivativesAccount: true, // true: spot -> derivatives, false: derivatives -> spot
});
```

#### Vault Methods

```typescript
// Deposit to a vault
await exchange.depositToVault({
  vaultAddress: '0xvault...',
  amount: '1000.0',
});

// Redeem shares from a vault
await exchange.redeemFromVault({
  vaultAddress: '0xvault...',
  shares: '500.0',
});
```

---

### SubscriptionClient

Subscribe to real-time data streams via WebSocket.

#### Creating a SubscriptionClient

```typescript
import { WebSocketTransport, SubscriptionClient } from '@hotstuff-labs/ts-sdk';

const transport = new WebSocketTransport({ isTestnet: true });
const subscriptions = new SubscriptionClient({ transport });
```

#### Market Subscriptions

```typescript
// Subscribe to ticker updates
const tickerSub = await subscriptions.ticker({ symbol: 'BTC-PERP' }, (event) =>
  console.log('Ticker:', event.detail),
);

// Subscribe to mid prices
const midsSub = await subscriptions.mids({ symbol: 'BTC-PERP' }, (event) =>
  console.log('Mids:', event.detail),
);

// Subscribe to best bid/offer
const bboSub = await subscriptions.bbo({ symbol: 'BTC-PERP' }, (event) =>
  console.log('BBO:', event.detail),
);

// Subscribe to orderbook updates
const orderbookSub = await subscriptions.orderbook({ instrumentId: 'BTC-PERP' }, (event) =>
  console.log('Orderbook:', event.detail),
);

// Subscribe to trades
const tradeSub = await subscriptions.trade({ instrumentId: 'BTC-PERP' }, (event) =>
  console.log('Trade:', event.detail),
);

// Subscribe to index prices
const indexSub = await subscriptions.index((event) => console.log('Index:', event.detail));

// Subscribe to chart updates
const chartSub = await subscriptions.chart(
  {
    symbol: 'BTC-PERP',
    chart_type: 'candles',
    resolution: '1m',
  },
  (event) => console.log('Chart:', event.detail),
);
```

#### Account Subscriptions

```typescript
const userAddress = '0x1234...';

// Subscribe to order updates
const orderSub = await subscriptions.accountOrderUpdates({ address: userAddress }, (event) =>
  console.log('Order update:', event.detail),
);

// Subscribe to balance updates
const balanceSub = await subscriptions.accountBalanceUpdates({ address: userAddress }, (event) =>
  console.log('Balance update:', event.detail),
);

// Subscribe to position updates
const positionSub = await subscriptions.positions({ address: userAddress }, (event) =>
  console.log('Position update:', event.detail),
);

// Subscribe to fills
const fillsSub = await subscriptions.fills({ address: userAddress }, (event) =>
  console.log('Fill:', event.detail),
);

// Subscribe to account summary
const accountSummarySub = await subscriptions.accountSummary({ user: userAddress }, (event) =>
  console.log('Account summary:', event.detail),
);
```

#### Explorer Subscriptions

```typescript
// Subscribe to new blocks
const blocksSub = await subscriptions.blocks({}, (event) =>
  console.log('New block:', event.detail),
);

// Subscribe to new transactions
const txSub = await subscriptions.transactions({}, (event) =>
  console.log('New transaction:', event.detail),
);
```

#### Unsubscribing

All subscription methods return an object with an `unsubscribe` function:

```typescript
const sub = await subscriptions.ticker({ symbol: 'BTC-PERP' }, handler);

// Later...
await sub.unsubscribe();
```

---

## Transports

### HttpTransport

HTTP transport for making API requests to the Hotstuff Labs API.

#### Configuration

```typescript
import { HttpTransport } from '@hotstuff-labs/ts-sdk';

const transport = new HttpTransport({
  // Use testnet or mainnet (default: false = mainnet)
  isTestnet: true,

  // Request timeout in milliseconds (default: 3000, set null to disable)
  timeout: 5000,

  // Custom server endpoints
  server: {
    mainnet: {
      api: 'https://api.hotstuff.trade/',
      rpc: 'https://rpc.hotstuff.trade/',
    },
    testnet: {
      api: 'https://testnet-api.hotstuff.trade/',
      rpc: 'https://testnet-api.hotstuff.trade/',
    },
  },

  // Additional fetch options (merged into all requests)
  fetchOptions: {
    headers: {
      'X-Custom-Header': 'value',
    },
  },

  // Request interceptor
  onRequest: (request) => {
    console.log('Making request:', request.url);
    return request; // return modified Request or original
  },

  // Response interceptor
  onResponse: (response) => {
    console.log('Got response:', response.status);
    return response; // return modified Response or original
  },
});
```

#### Default Endpoints

- **Mainnet:** `https://testnet-api.hotstuff.trade/`
- **Testnet:** `https://testnet-api.hotstuff.trade/`

---

### WebSocketTransport

WebSocket transport for real-time subscriptions using JSON-RPC 2.0.

#### Configuration

```typescript
import { WebSocketTransport } from '@hotstuff-labs/ts-sdk';

const transport = new WebSocketTransport({
  // Use testnet or mainnet (default: false = mainnet)
  isTestnet: true,

  // Request timeout in milliseconds (default: 10000)
  timeout: 15000,

  // Custom server endpoints
  server: {
    mainnet: 'wss://api.hotstuff.trade/ws/',
    testnet: 'wss://testnet-api.hotstuff.trade/ws/',
  },

  // Keep-alive ping configuration
  keepAlive: {
    interval: 30000, // ping every 30 seconds
    timeout: 10000, // timeout after 10 seconds
  },

  // Auto-connect on creation (default: true)
  autoConnect: true,
});
```

#### Connection Management

```typescript
// Manually connect (if autoConnect is false)
await transport.connect();

// Check connection status
if (transport.isConnected()) {
  console.log('Connected!');
}

// Manually disconnect
await transport.disconnect();

// Send ping
const pong = await transport.ping();
```

#### Reconnection

The WebSocket transport automatically reconnects with exponential backoff:

- Maximum attempts: 5
- Initial delay: 1 second
- Delay multiplier: attempt number

#### Default Endpoints

- **Mainnet:** `wss://testnet-api.hotstuff.trade/ws/`
- **Testnet:** `wss://testnet-api.hotstuff.trade/ws/`

---

## Advanced Usage

### TypeScript Support

All types are exported and can be imported for use in your application:

```typescript
import type { TransportsTypes, ClientsTypes } from '@hotstuff-labs/ts-sdk';

// Use transport types
type HttpOptions = TransportsTypes.IHttpTransportOptions;

// Use client parameter types
type ExchangeParams = ClientsTypes.IExchangeClientParameters<
  TransportsTypes.IRequestTransport,
  any
>;
```

### Request Cancellation

Both HTTP and WebSocket operations support AbortSignal:

```typescript
const controller = new AbortController();

// HTTP request
const promise = info.ticker({ symbol: 'BTC-PERP' }, controller.signal);

// Cancel after 1 second
setTimeout(() => controller.abort(), 1000);

try {
  const result = await promise;
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled');
  }
}
```

### Managing Multiple Subscriptions

```typescript
const subscriptions = new SubscriptionClient({ transport: wsTransport });
const activeSubs: Array<{ subscriptionId: string; unsubscribe: () => Promise<void> }> = [];

// Subscribe to multiple channels
const symbols = ['BTC-PERP', 'ETH-PERP', 'SOL-PERP'];
for (const symbol of symbols) {
  const sub = await subscriptions.ticker({ symbol }, (event) => {
    console.log(`${symbol}:`, event.detail);
  });
  activeSubs.push(sub);
}

// Unsubscribe from all
await Promise.all(activeSubs.map((sub) => sub.unsubscribe()));
```

### Environment-Specific Configuration

```typescript
const isProduction = process.env.NODE_ENV === 'production';

const httpTransport = new HttpTransport({
  isTestnet: !isProduction,
  timeout: isProduction ? 5000 : 10000,
});

const wsTransport = new WebSocketTransport({
  isTestnet: !isProduction,
  keepAlive: {
    interval: isProduction ? 30000 : 60000,
    timeout: 10000,
  },
});
```

---

## Error Handling

### HTTP Errors

HTTP transport throws errors with descriptive messages from the server:

```typescript
try {
  await exchange.placeOrder({
    /* ... */
  });
} catch (error) {
  if (error instanceof Error) {
    // Error message from server or network error
    console.error('Failed to place order:', error.message);
  }
}
```

### WebSocket Errors

WebSocket subscriptions can fail during subscribe:

```typescript
try {
  const sub = await subscriptions.ticker({ symbol: 'BTC-PERP' }, handler);
} catch (error) {
  if (error instanceof Error) {
    console.error('Subscription failed:', error.message);
  }
}
```

### Timeout Handling

Both transports have configurable timeouts:

```typescript
// Disable timeout
const transport = new HttpTransport({ timeout: null });

// Custom timeout
const transport = new HttpTransport({ timeout: 10000 }); // 10 seconds
```

---

## Examples

### Complete Trading Bot Example

```typescript
import {
  HttpTransport,
  WebSocketTransport,
  InfoClient,
  ExchangeClient,
  SubscriptionClient,
} from '@hotstuff-labs/ts-sdk';
import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

async function main() {
  // Setup
  const httpTransport = new HttpTransport({ isTestnet: true });
  const wsTransport = new WebSocketTransport({ isTestnet: true });

  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
  const wallet = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  });

  const info = new InfoClient({ transport: httpTransport });
  const exchange = new ExchangeClient({ transport: httpTransport, wallet });
  const subscriptions = new SubscriptionClient({ transport: wsTransport });

  // Get current market data
  const ticker = await info.ticker({ symbol: 'BTC-PERP' });
  console.log('Current price:', ticker);

  // Subscribe to live updates
  const tickerSub = await subscriptions.ticker({ symbol: 'BTC-PERP' }, async (event) => {
    const price = event.detail.last;
    console.log('Live price:', price);

    // Simple trading logic
    if (price < 50000) {
      try {
        await exchange.placeOrder({
          orders: [
            {
              instrumentId: 1,
              side: 'b',
              positionSide: 'BOTH',
              price: price.toString(),
              size: '0.1',
              tif: 'GTC',
              ro: false,
              po: false,
              cloid: `order-${Date.now()}`,
            },
          ],
          expiresAfter: Date.now() + 3600,
        });
        console.log('Order placed!');
      } catch (error) {
        console.error('Order failed:', error);
      }
    }
  });

  // Run for 1 hour then cleanup
  await new Promise((resolve) => setTimeout(resolve, 3600000));
  await tickerSub.unsubscribe();
  await wsTransport.disconnect();
}

main();
```

### Broker Fee with Agent Trading Example

This example demonstrates the full flow of approving a broker fee from the main account, creating an agent, and placing orders through the agent with broker configuration.

```typescript
import { HttpTransport, ExchangeClient } from '@hotstuff-labs/ts-sdk';
import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';

async function brokerAgentTradingExample() {
  const httpTransport = new HttpTransport({ isTestnet: true });

  // Main account setup (the account that will approve broker fees and create agent)
  const mainAccount = privateKeyToAccount(process.env.MAIN_PRIVATE_KEY as `0x${string}`);
  const mainWallet = createWalletClient({
    account: mainAccount,
    chain: mainnet,
    transport: http(),
  });

  const mainExchange = new ExchangeClient({
    transport: httpTransport,
    wallet: mainWallet,
  });

  // Broker address that will receive fees
  const brokerAddress = '0xBrokerAddress...' as `0x${string}`;

  // Step 1: Approve broker fee from main account
  console.log('Approving broker fee...');
  await mainExchange.approveBrokerFee({
    broker: brokerAddress,
    maxFeeRate: '0.001', // 0.1% max fee rate
  });
  console.log('Broker fee approved!');

  // Step 2: Generate agent credentials and add agent
  const agentPrivateKey = generatePrivateKey();
  const agentAccount = privateKeyToAccount(agentPrivateKey);

  console.log('Adding agent...');
  await mainExchange.addAgent({
    agentName: 'broker-trading-agent',
    agent: agentAccount.address,
    forAccount: '',
    agentPrivateKey: agentPrivateKey,
    signer: mainAccount.address,
    validUntil: Date.now() + 86400 * 30, // Valid for 30 days
  });
  console.log('Agent added:', agentAccount.address);

  // Step 3: Create exchange client for the agent
  const agentWallet = createWalletClient({
    account: agentAccount,
    chain: mainnet,
    transport: http(),
  });

  const agentExchange = new ExchangeClient({
    transport: httpTransport,
    wallet: agentWallet,
  });

  // Step 4: Place order from agent with broker config
  console.log('Placing order with broker fee...');
  await agentExchange.placeOrder({
    orders: [
      {
        instrumentId: 1,
        side: 'b',
        positionSide: 'BOTH',
        price: '50000.00',
        size: '0.1',
        tif: 'GTC',
        ro: false,
        po: false,
        cloid: `broker-order-${Date.now()}`,
      },
    ],
    brokerConfig: {
      broker: brokerAddress,
      fee: '0.0005', // 0.05% fee (must be <= approved maxFeeRate)
    },
    expiresAfter: Date.now() + 3600,
  });
  console.log('Order placed with broker fee!');

  // Optional: Revoke agent when done
  // await mainExchange.revokeAgent({ agent: agentAccount.address });
}

brokerAgentTradingExample();
```

---

## Signing

### How Signing Works

The SDK uses EIP-712 typed data signing for all exchange actions. Here's what happens under the hood:

1. **Action Encoding**: The action payload is encoded using MessagePack
2. **Hashing**: The encoded bytes are hashed with keccak256
3. **EIP-712 Signing**: The hash is signed using EIP-712 typed data with the following structure:

```typescript
const domain = {
  name: 'HotstuffCore',
  version: '1',
  chainId: 1,
  verifyingContract: '0x1234567890123456789012345678901234567890',
};

const types = {
  Action: [
    { name: 'source', type: 'string' },    // "Testnet" or "Mainnet"
    { name: 'hash', type: 'bytes32' },     // keccak256 of msgpack-encoded action
    { name: 'txType', type: 'uint16' },    // transaction type identifier
  ],
};
```

### Debugging Signature Issues

It is recommended to use an existing SDK instead of manually generating signatures. There are many potential ways in which signatures can be wrong. An incorrect signature results in recovering a different signer based on the signature and payload and results in one of the following errors:

```
"Error: account does not exist."
```

```
"invalid order signer"
```

where the returned address does not match the public address of the wallet you are signing with. The returned address also changes for different inputs.

An incorrect signature does not indicate why it is incorrect which makes debugging more challenging. To debug this it is recommended to read through the SDK carefully and make sure the implementation matches exactly. If that doesn't work, add logging to find where the output diverges.

---
