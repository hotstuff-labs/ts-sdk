/**Oracle Method */
export interface IOracleMethodParams {
  symbol: string;
}

export interface IOracleMethodResponse {
  symbol: string;
  index_price: string;
  ext_mark_price: string;
  updated_at: number;
}

/**Supported Collateral */
export interface ISupportedCollateralMethodParams {
  symbol: string;
}

export interface ISupportedCollateral {
  id: number;
  symbol: string;
  name: string;
  decimals: number;
  default_coll_weight: number;
  price_index: string;
  type: number;
  bridge_by_chain: {
    bridge_chain_type: number;
    bridge_chain_id: number;
    token_address: string;
    bridge_contract_address: string;
    enabled: boolean;
  }[];
  coll_risk: {
    weight_tiers: {
      amount: number;
      weight: number;
    }[];
    max_margin_cap: number;
    stale_price_guard_weight: number;
  }[];
  withdrawal_fee: number;
  added_at_block: number;
}

export type ISupportedCollateralMethodResponse = ISupportedCollateral[];

/**Instruments */
export interface IInstrumentsMethodParams {
  type: "perps" | "spot" | "all";
}

export interface MarginTier {
  notional_usd_threshold: string;
  max_leverage: number;
  mmr: number;
  mmd: number;
}

export interface IPerpInstrument {
  id: number;
  name: string;
  price_index: string;
  lot_size: number;
  tick_size: number;
  settlement_currency: number;
  only_isolated: boolean;
  max_leverage: number;
  delisted: boolean;
  min_notional_usd: number;
  margin_tiers: MarginTier[];
  listed_at_block_timestamp: number;
}

export interface ISpotInstrument {
  id: number;
  name: string;
  price_index: string;
  lot_size: number;
  tick_size: number;
  base_asset: number;
  quote_asset: number;
  stable_pair: boolean;
  min_size_in_quote_asset: number;
  listed_at_block_timestamp: number;
}

export interface IInstrumentsMethodResponse {
  perps: IPerpInstrument[];
  spot: ISpotInstrument[];
}

/**Ticker */
export interface ITickerMethodParams {
  symbol: string;
}

export interface ITicker {
  type: "perp" | "spot";
  symbol: string;
  mark_price: string;
  mid_price: string;
  index_price: string;
  best_bid_price: string;
  best_ask_price: string;
  best_bid_size: string;
  best_ask_size: string;
  funding_rate: string;
  open_interest: string;
  volume_24h: string;
  change_24h: string;
  max_trading_price: string;
  min_trading_price: string;
  last_updated: number;
  last_price: string;
}

export type ITickerMethodResponse = ITicker[];

/**Orderbook */
export interface IOrderbookMethodParams {
  symbol: string;
  depth?: number;
}

export interface IOrderbookLevel {
  price: string;
  size: string;
}

export interface IOrderbookMethodResponse {
  bids: IOrderbookLevel[];
  asks: IOrderbookLevel[];
  instrument_name: string;
  timestamp: number;
  sequence_number: number;
}

/**Trades */
export interface ITradesMethodParams {
  symbol: string;
  limit?: number;
}

export interface ITrade {
  instrument_id: number;
  instrument: string;
  trade_id: number;
  tx_hash: string;
  side: "b" | "s";
  price: string;
  size: string;
  maker: string;
  taker: string;
  timestamp: string;
}

export type ITradesMethodResponse = ITrade[];

/**Mids */
export interface IMidsMethodParams {
  symbol: string;
}

export interface IMid {
  symbol: string;
  mid_price: string;
}

export type IMidsMethodResponse = IMid[];

/**BBO */
export interface IBBOMethodParams {
  symbol: string;
}

export interface IBBO {
  symbol: string;
  best_bid_price: string;
  best_ask_price: string;
  best_bid_size: string;
  best_ask_size: string;
}

export type IBBOMethodResponse = IBBO[];

/**Chart */
export type SupportedChartResolutions =
  | "1"
  | "5"
  | "15"
  | "60"
  | "240"
  | "1D"
  | "1W";

export type SupportedChartTypes = "mark" | "ltp" | "index";

export interface IChartMethodParams {
  instrument_id: number;
  resolution: SupportedChartResolutions;
  from: number;
  to: number;
  chart_type: SupportedChartTypes;
}

export interface IChartPoint {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: number;
}

export type IChartMethodResponse = IChartPoint[];
