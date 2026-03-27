import { Address } from 'viem';

/**---Place Order Method---*/
export interface IUnitOrder {
  instrumentId: number;
  side: 'b' | 's';
  positionSide: 'LONG' | 'SHORT' | 'BOTH';
  price: string;
  size: string;
  tif: 'GTC' | 'IOC' | 'FOK';
  ro: boolean;
  po: boolean;
  cloid: string;
  triggerPx: string;
  isMarket: boolean;
  tpsl: 'tp' | 'sl' | '';
  grouping: 'position' | 'normal' | '';
}

export interface IBrokerConfig {
  broker: Address;
  fee: string;
}

export interface IPlaceOrderMethodParams {
  orders: IUnitOrder[];
  expiresAfter: number;
  brokerConfig?: IBrokerConfig;
  nonce?: number;
}

/**---Cancel By Oid Method---*/
export interface IUnitCancelByOrderId {
  oid: number;
  instrumentId: number;
}

export interface ICancelByOidMethodParams {
  cancels: IUnitCancelByOrderId[];
  expiresAfter: number;
  nonce?: number;
}

/**---Cancel By Cloid Method---*/
export interface IUnitCancelByClOrderId {
  cloid: string;
  instrumentId: number;
}

export interface ICancelByCloidMethodParams {
  cancels: IUnitCancelByClOrderId[];
  expiresAfter: number;
  nonce?: number;
}

/**---Cancel By Instrument Method---*/
export interface ICancelByInstrumentMethodParams {
  instrumentId: number;
  expiresAfter: number;
  nonce?: number;
}

/**---Cancel All Method---*/
export interface ICancelAllMethodParams {
  expiresAfter: number;
  nonce?: number;
}
