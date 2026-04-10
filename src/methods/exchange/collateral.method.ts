import type { Address } from "viem";

/**---Account Spot Withdraw Request Method---*/
export interface IAccountSpotWithdrawRequestMethodParams {
	collateralId: number;
	amount: string;
	chainId: number;
	nonce?: number;
}

/**---Account Derivative Withdraw Request Method---*/
export interface IAccountDerivativeWithdrawRequestMethodParams {
	collateralId: number;
	amount: string;
	chainId: number;
	nonce?: number;
}

/**---Account Spot Balance Transfer Request Method---*/
export interface IAccountSpotBalanceTransferRequestMethodParams {
	collateralId: number;
	amount: string;
    destination: Address;
    nonce?: number;
}

/**---Account Derivative Balance Transfer Request Method---*/
export interface IAccountDerivativeBalanceTransferRequestMethodParams {
	collateralId: number;
	amount: string;
	destination: Address;
	nonce?: number;
}


/**---Account Internal Balance Transfer Request Method---*/
export interface IAccountInternalBalanceTransferRequestMethodParams {
	collateralId: number;
	amount: string;
	toDerivativesAccount: boolean;
	nonce?: number;
}

