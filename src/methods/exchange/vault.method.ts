import type { Address } from "viem";

/**---Deposit To Vault Method---*/
export interface IDepositToVaultMethodParams {
    vaultAddress: Address;
    amount: string;
    nonce?: number;
}
  

/**---Redeem From Vault Method---*/
export interface IRedeemFromVaultMethodParams {
    vaultAddress: Address;
    shares: string;
    nonce?: number;
}
  