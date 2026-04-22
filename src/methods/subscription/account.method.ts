export interface IWSOrder {
  instrument_id: number;
  instrument: string;
  account: string;
  tif: string;
  order_id: number;
  cloid: string;
  side: "b" | "s";
  position_side: "BOTH" | "LONG" | "SHORT";
  limit_price: string;
  size: string;
  old_price: string;
  old_size: string;
  unfilled: string;
  state: "open" | "filled" | "cancelled" | "triggered";
  reduce_only: boolean;
  post_only: boolean;
  timestamp: number;
}

export interface IWSFill {
  instrument_id: number;
  instrument: string;
  account: string;
  order_id: number;
  cloid: string;
  trade_id: number;
  side: "b" | "s";
  position_side: "BOTH" | "LONG" | "SHORT";
  price: number;
  size: number;
  closed_pnl: number;
  direction: "openLong" | "openShort" | "closeLong" | "closeShort";
  original_size: number;
  original_price: number;
  fee: number;
  broker_fee: number;
  fee_token_id: number;
  crossed: boolean;
  tx_hash: string;
  fill_type: number;
  block_timestamp: number;
}
