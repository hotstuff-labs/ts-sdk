export type SupportedChartResolutions =
  | "1"
  | "5"
  | "15"
  | "30"
  | "60"
  | "240"
  | "1D"
  | "1W";

export type SupportedChartTypes = "mark" | "ltp" | "index";

export interface IOrderbookParams {
  symbol: string;
}

export interface IWSTicker {
  instrument_name: string;
  instrument_id: number;
  symbol: string;
  mark_price: number;
  mid_price: number;
  index_price: number;
  best_bid_price: number;
  best_ask_price: number;
  best_bid_size: number;
  best_ask_size: number;
  funding_rate: number;
  volume_24h: number;
  change_24h: number;
  open_interest: number;
  max_trading_price: number;
  min_trading_price: number;
  premium: number;
  last_price: number;
}

export interface IWSOrderbook {
  update_type: "snapshot" | "update";
  instrument_name: string;
  books: {
    bids: Array<{
      price: number;
      size: number;
    }>;
    asks: Array<{
      price: number;
      size: number;
    }>;
    sequence_number: number;
    timestamp: number;
  };
}

export interface IWSTrade {
  instrument_id: number;
  instrument: string;
  trade_id: number;
  tx_hash: string;
  side: "b" | "s";
  price: number;
  size: number;
  maker: string;
  taker: string;
  timestamp: number;
}

export interface IWSChart {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IOrderUpdate {
  id: string;
  account: string;
  instrument: string;
  price: number;
  size: number;
  side: "buy" | "sell";
  status: string;
  timestamp: number;
}

export interface IAccountBalanceUpdate {
  account: string;
  balances: Array<{
    asset: string;
    total: number;
    available: number;
    locked: number;
  }>;
  timestamp: number;
}
