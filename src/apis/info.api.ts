import { ClientsTypes as CT, TransportsTypes as TT } from '../types';

import {
  GlobalInfoMethods as GM,
  AccountInfoMethods as AM,
  VaultInfoMethods as VM,
  ExplorerInfoMethods as EM,
} from '../methods';

export class InfoClient<T extends TT.IRequestTransport> {
  transport: T;

  constructor(args: CT.IInfoClientParameters<T>) {
    this.transport = args.transport;
  }

  /**---Global Info Endpoints---*/

  async oracle(
    params: GM.IOracleMethodParams,
    signal?: AbortSignal,
  ): Promise<GM.IOracleMethodResponse> {
    const request = {
      method: 'oracle',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async supportedCollateral(
    params: GM.ISupportedCollateralMethodParams,
    signal?: AbortSignal,
  ): Promise<GM.ISupportedCollateralMethodResponse> {
    const request = {
      method: 'supportedCollateral',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async instruments(
    params: GM.IInstrumentsMethodParams,
    signal?: AbortSignal,
  ): Promise<GM.IInstrumentsMethodResponse> {
    const request = {
      method: 'instruments',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async ticker(
    params: GM.ITickerMethodParams,
    signal?: AbortSignal,
  ): Promise<GM.ITickerMethodResponse> {
    const request = {
      method: 'ticker',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async orderbook(
    params: GM.IOrderbookMethodParams,
    signal?: AbortSignal,
  ): Promise<GM.IOrderbookMethodResponse> {
    const request = {
      method: 'orderbook',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async trades(
    params: GM.ITradesMethodParams,
    signal?: AbortSignal,
  ): Promise<GM.ITradesMethodResponse> {
    const request = {
      method: 'trades',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async mids(params: GM.IMidsMethodParams, signal?: AbortSignal): Promise<GM.IMidsMethodResponse> {
    const request = {
      method: 'mids',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async bbo(params: GM.IBBOMethodParams, signal?: AbortSignal): Promise<GM.IBBOMethodResponse> {
    const request = {
      method: 'bbo',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async chart(
    params: GM.IChartMethodParams,
    signal?: AbortSignal,
  ): Promise<GM.IChartMethodResponse> {
    const request = {
      method: 'chart',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  /**Account Info Endpoints */
  async openOrders(
    params: AM.IOpenOrdersParams,
    signal?: AbortSignal,
  ): Promise<AM.IOpenOrdersResponse> {
    const request = {
      method: 'openOrders',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async positions(
    params: AM.IPositionsParams,
    signal?: AbortSignal,
  ): Promise<AM.IPositionsResponse> {
    const request = {
      method: 'positions',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async accountSummary(
    params: AM.IAccountSummaryParams,
    signal?: AbortSignal,
  ): Promise<AM.IAccountSummaryResponse> {
    const request = {
      method: 'accountSummary',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async referralSummary(
    params: AM.IReferralSummaryParams,
    signal?: AbortSignal,
  ): Promise<AM.IReferralSummaryResponse> {
    const request = {
      method: 'referralSummary',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async userFeeInfo(
    params: AM.IUserFeeInfoParams,
    signal?: AbortSignal,
  ): Promise<AM.IUserFeeInfoResponse> {
    const request = {
      method: 'userFees',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async accountHistory(
    params: AM.IAccountHistoryParams,
    signal?: AbortSignal,
  ): Promise<AM.IAccountHistoryResponse> {
    const request = {
      method: 'accountHistory',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async orderHistory(
    params: AM.IOrderHistoryParams,
    signal?: AbortSignal,
  ): Promise<AM.IOrderHistoryResponse> {
    const request = {
      method: 'orderHistory',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async tradeHistory(
    params: AM.ITradeHistoryParams,
    signal?: AbortSignal,
  ): Promise<AM.ITradeHistoryResponse> {
    const request = {
      method: 'fills',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async fundingHistory(
    params: AM.IFundingHistoryParams,
    signal?: AbortSignal,
  ): Promise<AM.IFundingHistoryResponse> {
    const request = {
      method: 'fundingHistory',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async transferHistory(
    params: AM.ITransferHistoryParams,
    signal?: AbortSignal,
  ): Promise<AM.ITransferHistoryResponse> {
    const request = {
      method: 'transferHistory',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async instrumentLeverage(
    params: AM.IInstrumentLeverageParams,
    signal?: AbortSignal,
  ): Promise<AM.IInstrumentLeverageResponse> {
    const request = {
      method: 'instrumentLeverage',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async agents(params: AM.IAgentsParams, signal?: AbortSignal): Promise<AM.IAgentsResponse> {
    const request = {
      method: 'allAgents',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async accountInfo(
    params: AM.IAccountInfoParams,
    signal?: AbortSignal,
  ): Promise<AM.IAccountInfoResponse> {
    const request = {
      method: 'accountInfo',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async brokersCheck(params: AM.IBrokersCheckParams, signal?: AbortSignal): Promise<AM.IBrokersCheckResponse> {
    const request = {
      method: 'brokersCheck',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  /**---Vault Info Endpoints---*/

  async vaults(params: VM.IVaultsParams, signal?: AbortSignal): Promise<VM.IVaultsResponse> {
    const request = {
      method: 'vaults',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async subVaults(
    params: VM.ISubVaultsParams,
    signal?: AbortSignal,
  ): Promise<VM.ISubVaultsResponse> {
    const request = {
      method: 'subVaults',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  async vaultBalances(
    params: VM.IVaultBalancesParams,
    signal?: AbortSignal,
  ): Promise<VM.IVaultBalancesResponse> {
    const request = {
      method: 'vaultBalance',
      params,
    };
    return this.transport.request('info', request, signal);
  }

  /** Explorer Info Endpoints */

  async blocks(
    params: EM.IBlocksMethodParams,
    signal?: AbortSignal,
  ): Promise<EM.IBlocksMethodResponse> {
    const request = {
      method: 'blocks',
      params,
    };
    return this.transport.request('explorer', request, signal);
  }

  async blockDetails(
    params: EM.IBlockDetailsMethodParams,
    signal?: AbortSignal,
  ): Promise<EM.IBlockDetailsMethodResponse> {
    const request = {
      method: 'block',
      params,
    };
    return this.transport.request('explorer', request, signal);
  }

  async transactions(
    params: EM.ITransactionsMethodParams,
    signal?: AbortSignal,
  ): Promise<EM.ITransactionsMethodResponse> {
    const request = {
      method: 'transactions',
      params,
    };
    return this.transport.request('explorer', request, signal);
  }

  async transactionDetails(
    params: EM.ITransactionDetailsMethodParams,
    signal?: AbortSignal,
  ): Promise<EM.ITransactionDetailsMethodResponse> {
    const request = {
      method: 'transaction',
      params,
    };
    return this.transport.request('explorer', request, signal);
  }
}
