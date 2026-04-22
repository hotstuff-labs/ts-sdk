import { ClientsTypes as CT, TransportsTypes as TT } from "../types";
import type { Address } from "viem";

import {
  GlobalSubscriptionMethods as GSM,
  AccountSubscriptionMethods as ASM,
  AccountInfoMethods as AIM,
} from "../methods";

export class SubscriptionClient<T extends TT.ISubscriptionTransport> {
  transport: T;

  constructor(args: CT.ISubscriptionClientParameters<T>) {
    this.transport = args.transport;
  }

  /** Global Subscription Endpoints */

  async ticker(
    params: { symbol: string },
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const result = await this.transport.subscribe("ticker", params, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async orderbook(
    params: GSM.IOrderbookParams,
    listener: (data: CustomEvent<GSM.IWSOrderbook>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      symbol: params.symbol,
    };

    const result = await this.transport.subscribe<any>(
      "orderbook",
      request,
      listener,
    );
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async trades(
    params: { symbol: string },
    listener: (data: CustomEvent<GSM.IWSTrade>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      symbol: params.symbol,
    };

    const result = await this.transport.subscribe("trades", request, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async mids(
    params: { symbol: string },
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const result = await this.transport.subscribe("mids", params, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async bbo(
    params: { symbol: string },
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const result = await this.transport.subscribe("bbo", params, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async index(
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const result = await this.transport.subscribe("index", {}, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async chart(
    params: {
      instrument_id: number;
      chart_type: GSM.SupportedChartTypes;
      resolution: GSM.SupportedChartResolutions;
    },
    listener: (data: CustomEvent<GSM.IWSChart>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const result = await this.transport.subscribe("chart", params, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  /** Account Subscription Endpoints */
  async accountSummary(
    params: { user: Address },
    listener: (data: CustomEvent<AIM.IAccountSummaryResponse>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      user: params.user,
    };
    const result = await this.transport.subscribe(
      "account_summary",
      request,
      listener,
    );
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async orders(
    params: { user: Address },
    listener: (data: CustomEvent<ASM.IWSOrder>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      user: params.user,
    };

    const result = await this.transport.subscribe("orders", request, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async positions(
    params: { address: string },
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      address: params.address,
      user: params.address,
    };

    const result = await this.transport.subscribe(
      "position",
      request,
      listener,
    );
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async fills(
    params: { user: Address },
    listener: (data: CustomEvent<ASM.IWSFill>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      user: params.user,
    };

    const result = await this.transport.subscribe("fills", request, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async fundingPayments(
    params: { user: Address },
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      user: params.user,
    };

    const result = await this.transport.subscribe(
      "funding_payments",
      request,
      listener,
    );
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async agents(
    params: { user: Address },
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      user: params.user,
    };

    const result = await this.transport.subscribe("agent", request, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  /** Explorer Subscription Endpoints */

  async blocks(
    params: {},
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {};
    const result = await this.transport.subscribe("blocks", request, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async transactions(
    params: {},
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {};
    const result = await this.transport.subscribe(
      "transactions",
      request,
      listener,
    );
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }
}
