import { privateKeyToAccount } from 'viem/accounts';
import { ClientsTypes as CT, TransportsTypes as TT } from '../types';
import { signAction, NonceManager } from '../utils';
import {
  AccountExchangeMethods as AM,
  TradingExchangeMethods as TM,
  CollateralExchangeMethods as CM,
  VaultExchangeMethods as VM,
  EXCHANGE_OP_CODES,
} from '../methods';

export class ExchangeClient<T extends TT.IRequestTransport, W> {
  transport: T;
  wallet: W;
  nonce: () => TT.IMaybePromise<number>;

  constructor(args: CT.IExchangeClientParameters<T, W>) {
    this.transport = args.transport;
    this.wallet = args.wallet;
    this.nonce = args.nonce ?? new NonceManager().getNonce;
  }

  /**---Account Management Methods---*/
  async addAgent(params: AM.IAddAgentMethodParams, execute = true, opts?: any): Promise<any> {
    let nonce = await this.nonce();

    const agentAccount = privateKeyToAccount(params.agentPrivateKey as `0x${string}`);

    const agentSignature = await signAction({
      wallet: agentAccount,
      action: {
        signer: params.signer,
        nonce: nonce,
      },
      txType: EXCHANGE_OP_CODES['addAgent'],
    });

    params = {
      agentName: params.agentName,
      agent: params.agent,
      forAccount: params.forAccount,
      signature: agentSignature,
      validUntil: params.validUntil,
      nonce: nonce,
    };

    return this._executeAction({ action: 'addAgent', params }, opts?.signal, execute);
  }

  async revokeAgent(params: AM.IRevokeAgentMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'revokeAgent', params }, opts?.signal);
  }

  async updatePerpInstrumentLeverage(params: AM.IUpdatePerpInstrumentLeverageMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'updatePerpInstrumentLeverage', params }, opts?.signal);
  }

  async approveBrokerFee(params: AM.IApproveBrokerFeeMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'approveBrokerFee', params }, opts?.signal);
  }

  async createReferralCode(params: AM.ICreateReferralCodeMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'createReferralCode', params }, opts?.signal);
  }

  async setReferrer(params: AM.ISetReferrerMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'setReferrer', params }, opts?.signal);
  }

  async claimReferralRewards(params: AM.IClaimReferralRewardsMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'claimReferralRewards', params }, opts?.signal);
  }


  /**---Trading Methods---*/
  async placeOrder(params: TM.IPlaceOrderMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'placeOrder', params }, opts?.signal);
  }

  async cancelByOid(params: TM.ICancelByOidMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'cancelByOid', params }, opts?.signal);
  }

  async cancelByCloid(params: TM.ICancelByCloidMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'cancelByCloid', params }, opts?.signal);
  }

  async cancelByInstrument(params: TM.ICancelByInstrumentMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'cancelByInstrument', params }, opts?.signal);
  }


  async cancelAll(params: TM.ICancelAllMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'cancelAll', params }, opts?.signal);
  }

  /**---Collateral Transfer Methods---*/
  async accountSpotWithdrawRequest(params: CM.IAccountSpotWithdrawRequestMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'accountSpotWithdrawRequest', params }, opts?.signal);
  }

  async accountDerivativeWithdrawRequest(params: CM.IAccountDerivativeWithdrawRequestMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'accountDerivativeWithdrawRequest', params }, opts?.signal);
  }

  async accountSpotBalanceTransferRequest(params: CM.IAccountSpotBalanceTransferRequestMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'accountSpotBalanceTransferRequest', params }, opts?.signal);
  }

  async accountDerivativeBalanceTransferRequest(params: CM.IAccountDerivativeBalanceTransferRequestMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'accountDerivativeBalanceTransferRequest', params }, opts?.signal);
  }

  async accountInternalBalanceTransferRequest(params: CM.IAccountInternalBalanceTransferRequestMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'accountInternalBalanceTransferRequest', params }, opts?.signal);
  }

  /**---Vault Methods---*/
  async depositToVault(params: VM.IDepositToVaultMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'depositToVault', params }, opts?.signal);
  }

  async redeemFromVault(params: VM.IRedeemFromVaultMethodParams, opts?: any): Promise<any> {
    return this._executeAction({ action: 'redeemFromVault', params }, opts?.signal);
  }
  /**---Private Methods---*/
  private async _executeAction(request: CT.IActionRequest, signal?: AbortSignal, execute = true) {
    const { action, params } = request;

    params.nonce = params.nonce ?? (await this.nonce());

    let signature = await signAction(
      {
        wallet: this.wallet,
        action: params,
        txType: EXCHANGE_OP_CODES[action],
      },
      {
        isTestnet: this.transport.isTestnet,
      },
    );

    if (execute) {
      const response = await this.transport.request(
        'exchange',
        {
          action: {
            data: params,
            type: String(EXCHANGE_OP_CODES[action]),
          },
          signature,
          nonce: params.nonce,
        },
        signal,
      );

      return response;
    }

    return { params, signature };
  }
}
