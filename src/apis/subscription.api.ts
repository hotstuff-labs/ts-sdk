import { ClientsTypes as CT, TransportsTypes as TT } from "../types";

import { GlobalSubscriptionMethods as GM } from "../methods";

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

  async orderbook(
    params: GM.IOrderbookParams,
    listener: (data: CustomEvent<any>) => void,
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

  async trade(
    params: { instrumentId: string },
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      instrumentId: params.instrumentId,
      symbol: params.instrumentId,
    };

    const result = await this.transport.subscribe("trade", request, listener);
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
      symbol: string;
      chart_type: GM.SupportedChartTypes;
      resolution: GM.SupportedChartResolutions;
    },
    listener: (data: CustomEvent<GM.IChartUpdate>) => void,
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

  async accountOrderUpdates(
    params: { address: string },
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      address: params.address,
      user: params.address,
    };

    const result = await this.transport.subscribe("order", request, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async accountBalanceUpdates(
    params: { address: string },
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      address: params.address,
      user: params.address,
    };

    const result = await this.transport.subscribe("balance", request, listener);
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
    params: { address: string },
    listener: (data: CustomEvent<any>) => void,
  ): Promise<TT.ISubscriptionResult> {
    const request = {
      address: params.address,
      user: params.address,
    };

    const result = await this.transport.subscribe("fills", request, listener);
    const resultWithId = result as any;

    return {
      subscriptionId: resultWithId.subscriptionId,
      unsubscribe: () =>
        this.transport.unsubscribe(resultWithId.subscriptionId),
    };
  }

  async accountSummary(
    params: { user: string },
    listener: (data: CustomEvent<any>) => void,
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
