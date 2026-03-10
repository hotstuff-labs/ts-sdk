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

export interface IOrderbook {
  instrumentId: string;
  instrumentName?: string; // Alternative field name used by server
  asks: IOrderbookItem[];
  bids: IOrderbookItem[];
  timestamp: number;
}

export interface IOrderbookItem {
  price: number;
  size: number;
  amount?: number; // Alternative field name
}

// Additional subscription interfaces for other event types
export interface ITrade {
  id: string;
  instrument: string;
  instrumentName?: string;
  maker: string;
  taker: string;
  price: number;
  size: number;
  timestamp: number;
  side: "buy" | "sell";
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

export interface IChartUpdate {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  // in milliseconds
  time: number;
}
