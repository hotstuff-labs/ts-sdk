import { Address } from 'viem';

/** Vaults Method */
export interface IVaultsParams { }

export interface IVault {
  vault_address: Address;
  vault_manager: Address;
  name: string;
  symbol: string;
  deposit_cap: string;
  role: number;
  underlying_asset_id: number;
  lock_in_period: number;
  commission: string;
  min_share_of_vm: string;
  created_at: number;
  allow_deposits: boolean;
  always_close_on_withdraw: boolean;
  is_closed: boolean;
  updated_at: number;
}

export interface IVaultsResponse {
  vaults: IVault[];
}

/** Sub Vaults Method */
export interface ISubVaultsParams {
  vault_address: Address;
}

export interface ISubVault {
  vault_address: Address;
  sub_vault_address: Address;
  manager: Address;
  created_at: number;
}


export type ISubVaultsResponse = ISubVault[];

/** Vault Balances Method */
export interface IVaultBalancesParams {
  vault_address: Address;
  user?: Address;
}

export interface IVaultBalance {
  vault_address: Address;
  account: Address;
  amount: string;
  shares: string;
  updated_at: number;
}


export type IVaultBalancesResponse = IVaultBalance[];
