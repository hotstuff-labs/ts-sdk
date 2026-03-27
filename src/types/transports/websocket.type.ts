export interface IWebsocketTransportOptions {
  isTestnet?: boolean;

  timeout?: number | null;

  server?: {
    mainnet?: string | URL;
    testnet?: string | URL;
  };

  keepAlive?: {
    interval?: number | null;
    timeout?: number | null;
  };

  autoConnect?: boolean;
}

export enum WSMethod {
  SUBSCRIBE = "subscribe",
  UNSUBSCRIBE = "unsubscribe",
  PING = "ping",
  POST = "post",
}

export interface JSONRPCMessage {
  jsonrpc: "2.0";
  method: string;
  params?: any;
  id: string | number | null;
}

export interface JSONRPCResponse<T = any> {
  jsonrpc: "2.0";
  result?: T;
  error?: JSONRPCError;
  id: string | number | null;
}

export interface JSONRPCError {
  code: number;
  message: string;
  data?: any;
}

export interface JSONRPCNotification<T = any> {
  jsonrpc: "2.0";
  method: string;
  params: T;
}

export interface PongResult {
  timestamp: Date;
}

export enum WSEventType {
  DEPOSIT = "deposit",
  SPOT_WITHDRAW = "spot_withdraw",
  DERIVATIVE_WITHDRAW = "derivative_withdraw",
  ORDER_UPDATE = "order_update",
  TRADE = "trade",
  SPOT_TRADE = "spot_trade",
  ACCOUNT_BALANCE_UPDATED = "account_balance_updated",
  ACCOUNT_SPOT_BALANCE_UPDATED = "account_spot_balance_updated",
  AGENT_REGISTERED = "agent_registered",
  ACCOUNT_UPDATED = "account_updated",
  PRICE_INDEX_ADDED = "price_index_added",
  ORACLE_FEED_UPDATED = "oracle_feed_updated",
  PERP_LISTED = "perp_listed",
  SPOT_LISTED = "spot_listed",
  OPTION_LISTED = "option_listed",
  SPOT_BALANCE_TRANSFER = "spot_balance_transfer",
  DERIVATIVE_BALANCE_TRANSFER = "derivative_balance_transfer",
  INTERNAL_BALANCE_TRANSFER = "internal_balance_transfer",
  SPOT_SWAP_TRIGGERED = "spot_swap_triggered",
  EVM_COLLATERAL_ADDED = "evm_collateral_added",
  INDEXER_BOOK_UPDATE = "indexer_book_update",
  TICKER = "ticker",
}
