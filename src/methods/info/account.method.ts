import { Address } from 'viem';

/**Open Orders Method */
export interface IOpenOrdersParams {
  user: Address;
  page?: number;
  limit?: number;
}

export interface IOpenOrdersResponse {
  data: IOpenOrder[];
  page: number;
  limit: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface IOpenOrder {
  order_id: number;
  user: Address;
  instrument_id: number;
  instrument: string;
  side: 's' | 'b';
  position_side: 'LONG' | 'SHORT' | 'BOTH';
  limit_price: string;
  size: string;
  unfilled: string;
  state: 'open' | 'filled' | 'cancelled' | 'triggered';
  cloid: string;
  tif: 'GTC' | 'IOC' | 'FOK';
  post_only: boolean;
  reduce_only: boolean;
  trigger_px: string;
  is_market: boolean;
  tpsl: 'tp' | 'sl' | '';
  grouping: 'position' | 'normal' | '';
  timestamp: string;
}

/**Positions Method */
export interface IPositionsParams {
  user: Address;
  instrument?: string;
}

export type IPositionsResponse = IPosition[];


export interface IPosition {
  user: Address;
  instrument_id: number;
  instrument: string;
  position_side: 'LONG' | 'SHORT' | 'BOTH';
  size: string;
  entry_price: string;
  position_value: string;
  margin_mode: 'cross' | 'isolated';
  leverage: string;
  margin: string;
  updated_at: number;
}

/**Account Summary Method */
export interface IAccountSummaryParams {
  user: Address;
}

export interface IAccountSummaryResponse {
  address: Address,
  spot_collateral: Record<string, {
    balance: number,
    withdrawable_balance: number,
  }>,
  collateral: Record<string, {
    balance: number,
    withdrawable_balance: number,
  }>,
  vault_balances: Record<Address, {
    withdrawable_shares: number,
    total_shares: number,
    amount: number,
  }>,
  perp_positions: Record<string, {
    position_type: 'oneWay',
    legs: {
      instrument_id: number,
      instrument_name: string,
      side: 'BOTH' | 'LONG' | 'SHORT',
      size: number,
      entry_price: number,
      leverage: {
        type: 'cross' | 'isolated',
        value: number,
      },
      position_value: number,
    }[],
    liquidation_price: number,
    mm: number,
    im: number,
    upnl: number,
  }>,
  margin_mode: 'cross' | 'isolated',
  multi_asset_mode: boolean,
  hedge_mode: boolean,
  staked_collateral: number,
  initial_margin_utilization: number,
  maintenance_margin_utilization: number,
  upnl: number,
  total_account_equity: number,
  margin_balance: number,
  initial_margin: number,
  maintenance_margin: number,
  total_volume: number,
  total_pnl: number,
  available_balance: number,
  transfer_margin_req: number,
  max_drawdown: number,
  spot_account_equity: number,
  derivative_account_equity: number,
  spot_volume: number,

  vault_summary?: {
    apr: number,
    lock_in_period: number,
    shares: number,
    equity_daily: number[],
    daily_nav_changes: number[],
  },
}

/**Referral Summary Method */
export interface IReferralSummaryParams {
  user: Address;
}

export interface IReferralSummaryResponse {
  address: Address,
  referrer: Address,
  referrer_code: string,
  refer_timestamp: number,
  codes: string[],
  referred_users: Record<Address, {
    code: string,
    joined_at: number,
    referred_volume: number,
    perp_volume: {
      maker_volume: number,
      taker_volume: number,
    },
    spot_volume: {
      maker_volume: number,
      taker_volume: number,
    },
    stable_spot_volume: {
      maker_volume: number,
      taker_volume: number,
    },
    referred_perp_rewards: number,
    referred_spot_rewards: number,
  }>,
  to_claim_perp_rewards: number,
  to_claim_spot_rewards: number,
  claimed_perp_rewards: number,
  claimed_spot_rewards: number,
  total_referred_volume: number,
  rolling_referred_volume: number,
  referral_tier: {
    total_referred_volume: number,
    fee_discount_rate: number,
    referrer_commission: number,
  },
  updated_at: number,
}


/**User Fee Info Method */
export interface IUserFeeInfoParams {
  user: Address;
}

export interface IUserFeeInfoResponse {
  account: Address,
  spot_volume_14d: string,
  spot_volume_30d: string,
  stable_spot_volume_14d: string,
  stable_spot_volume_30d: string,
  perp_volume_14d: string,
  perp_volume_30d: string,
  option_volume_14d: string,
  option_volume_30d: string,
  total_volume_threshold: number,
  perp_maker_fee_rate: number,
  perp_taker_fee_rate: number,
  spot_maker_fee_rate: number,
  spot_taker_fee_rate: number,
  stable_spot_maker_fee_rate: number,
  stable_spot_taker_fee_rate: number,
  option_maker_fee_rate: number,
  option_taker_fee_rate: number
}

/**Account History Method */
export interface IAccountHistoryParams {
  user: Address;
}

export interface IAccountHistory {
  address: Address,
  total_pnl: string,
  total_volume: number,
  account_value: string,
  created_at: string,
}

export type IAccountHistoryResponse = IAccountHistory[];

/**Order History Method */
export interface IOrderHistoryParams {
  user: Address;
  instrumentId?: string;
  limit?: number;
}

export interface IOrderHistory {
  order_id: number,
  user: Address,
  instrument_id: number,
  instrument: string,
  side: 'b' | 's',
  position_side: 'BOTH' | 'LONG' | 'SHORT',
  limit_price: string,
  size: string,
  unfilled: string,
  state: 'filled' | 'cancelled' | 'open' | 'triggered',
  cloid: string,
  tif: 'GTC' | 'IOC' | 'FOK',
  post_only: boolean,
  reduce_only: boolean,
  trigger_px: string,
  is_market: boolean,
  tpsl: '' | 'tp' | 'sl',
  grouping: '' | 'position' | 'normal',
  timestamp: string,
}

export interface IOrderHistoryResponse {
  data: IOrderHistory[],
  page: number,
  limit: number,
  total_count: number,
  total_pages: number,
  has_next: boolean,
  has_prev: boolean,
}

/**Trade History Method */
export interface ITradeHistoryParams {
  user: Address;
  instrumentId?: string;
  limit?: number;
}

export interface ITradeHistory {
  instrument_id: number,
  instrument: string,
  account: Address,
  order_id: number,
  cloid: string,
  trade_id: number,
  side: 'b' | 's',
  position_side: 'BOTH' | 'LONG' | 'SHORT',
  direction: 'openLong' | 'openShort' | 'closeLong' | 'closeShort',
  price: string,
  size: string,
  closed_pnl: string,
  start_size: string,
  start_price: string,
  fee: string,
  broker_fee: string,
  fee_token_id: number,
  crossed: boolean,
  tx_hash: string,
  fill_type: number,
  notional_value: string,
  block_timestamp: string,
}

export interface ITradeHistoryResponse {
  data: ITradeHistory[],
  page: number,
  limit: number,
  total_count: number,
  totalPages: number,
  hasNext: boolean,
  hasPrev: boolean,
}

/**Funding History Method */
export interface IFundingHistoryParams {
  user: Address;
}

export interface IFundingHistory {
  user: Address,
  instrument_id: number,
  settlement_currency: number,
  funding_payment: string,
  funding_rate: string,
  mark_price: string,
  size: string,
  timestamp: string,
}

export interface IFundingHistoryResponse {
  data: IFundingHistory[],
  page: number,
  limit: number,
  total_count: number,
  total_pages: number,
  has_next: boolean,
  has_prev: boolean,
}

/**Transfer History Method */
export interface ITransferHistoryParams {
  user: Address;
  limit?: number;
}

export interface ITransferHistory {
  from: Address,
  to: Address,
  collateral_id: number,
  amount: string,
  tx_hash: string,
  type: "deposit" | "spot_withdraw" | "derivative_withdraw" | "spot_balance_transfer" | "derivative_balance_transfer" | "internal_balance_transfer" | "vault_deposit" | "vault_withdraw",
  timestamp: string,
}

export type ITransferHistoryResponse = ITransferHistory[];

/**Instrument Leverage Method */
export interface IInstrumentLeverageParams {
  user: Address;
  symbol: string;
}

export interface IInstrumentLeverageResponse {
  address: Address,
  instrument_id: number,
  instrument: string,
  margin_type: "cross" | "isolated",
  leverage: string,
  updated_at: number,
}

/**Agents Method */
export interface IAgentsParams {
  user: Address;
}

export interface IAgent {
  user: Address,
  agent_address: Address,
  agent_name: string,
  created_at_block_timestamp: number,
  valid_until_timestamp: number,
}

export type IAgentsResponse = IAgent[];


/**Account Info Method */
export interface IAccountInfoParams {
  user: Address;
  collateralID?: number;
  includeHistory?: boolean;
}

export interface IAccountInfoResponse {
  account: {
    address: Address,
    role: number,
    margin_mode: 'cross' | 'isolated',
    multi_asset_mode: boolean,
    hedge_mode: boolean,
    referrer: Address,
    referral_codes: string[],
    referral_timestamp: number,
    created_at_block_timestamp: number,
  },
  rewards: {
    account: Address,
    collateral_id: number,
    source: string,
    is_spot: boolean,
    amount: string,
    claim_amount: string,
    created_at: number,
  }[],
  history: {
    account: Address,
    collateral_id: number,
    source: string,
    is_spot: boolean,
    amount: string,
    claim_amount: string,
    created_at: number,
  }[],
}


/**Brokers Check Method */
export interface IBrokersCheckParams {
  user?: Address;
  broker?: Address;
  limit?: number;
  page?: number;
}

export interface IBrokersCheckResponse {
  data: {
    account: Address,
    broker: Address,
    max_fee_rate: string,
    updated_at: number,
  }[],
  page: number,
  limit: number,
  total_count: number,
  total_pages: number,
  has_next: boolean,
  has_prev: boolean
}