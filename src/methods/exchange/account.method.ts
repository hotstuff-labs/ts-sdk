import type { Address } from 'viem';

/**---Add Agent Method---*/
export interface IAddAgentMethodParams {
  agentName: string;
  agent: Address;
  forAccount: string;
  signature?: string;
  validUntil: number;
  nonce?: number;
  agentPrivateKey?: string;
  signer?: string;
}


/**---Revoke Agent Method---*/
export interface IRevokeAgentMethodParams {
  agent: Address;
  forAccount?: string;
  nonce?: number;
}


/**---Update Perp Instrument Leverage Method---*/
export interface IUpdatePerpInstrumentLeverageMethodParams {
  instrumentId: number;
  leverage: number;
  nonce?: number;
}


/**---Approve Broker Fee Method---*/
export interface IApproveBrokerFeeMethodParams {
  broker: Address;
  maxFeeRate: string;
  nonce?: number;
}


/**---Create Referral Code Method---*/
export interface ICreateReferralCodeMethodParams {
  code: string;
  nonce?: number;
}


/**---Set Referrer Method---*/
export interface ISetReferrerMethodParams {
  code: string;
  nonce?: number;
}


/**---Claim Referral Rewards Method---*/
export interface IClaimReferralRewardsMethodParams {
  collateralId: number;
  spot: boolean;
  nonce?: number;
}