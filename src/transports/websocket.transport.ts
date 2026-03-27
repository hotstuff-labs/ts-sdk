import { ENDPOINTS_URLS } from '../utils';
import { TransportsTypes as TT } from '../types';

export class WebSocketTransport {
  public isTestnet: boolean;
  private timeout: number | null;
  private ws: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  private server: {
    mainnet: string | URL;
    testnet: string | URL;
  };

  private keepAlive?: {
    interval?: number | null;
    timeout?: number | null;
  };

  private keepAliveInterval?: NodeJS.Timeout;

  private messageQueue: Array<{
    id: string;
    resolve: Function;
    reject: Function;
  }> = [];

  private messageIdCounter: number = 0;

  private subscriptions: Map<string, TT.ISubscription> = new Map();
  private subscriptionCallbacks: Map<string, TT.SubscriptionCallback> = new Map();

  private connectionPromise: Promise<void> | null = null;

  constructor(options?: TT.IWebsocketTransportOptions) {
    this.isTestnet = options?.isTestnet ?? false;
    this.timeout = options?.timeout ?? 10_000;

    this.server = {
      mainnet: options?.server?.mainnet ?? ENDPOINTS_URLS.mainnet.ws,
      testnet: options?.server?.testnet ?? ENDPOINTS_URLS.testnet.ws,
    };

    this.keepAlive = options?.keepAlive ?? {
      interval: 30_000,
      timeout: 10_000,
    };

    const autoConnect = options?.autoConnect ?? true;
    if (autoConnect) {
      this.connectionPromise = this.connect().catch((error) => {
        console.error('Auto-connect failed:', error);
      });
    }
  }

  private async ensureConnected(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    if (this.connectionPromise) {
      try {
        await this.connectionPromise;
      } catch (error) {
        this.connectionPromise = null;
      }
      if (this.ws?.readyState === WebSocket.OPEN) {
        return;
      }
    }

    this.connectionPromise = this.connect();
    try {
      await this.connectionPromise;
    } catch (error) {
      this.connectionPromise = null;
      throw error;
    }
  }

  private cleanup(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = undefined;
    }

    this.messageQueue.forEach(({ reject }) => {
      reject(new Error('WebSocket disconnected'));
    });

    this.messageQueue = [];
  }

  private startKeepAlive(): void {
    if (this.keepAlive?.interval) {
      this.keepAliveInterval = setInterval(() => {
        this.ping();
      }, this.keepAlive.interval);
    }
  }

  private handleIncomingMessage(message: any): void {
    if (
      message.id !== null &&
      message.id !== undefined &&
      (message.result !== undefined || message.error !== undefined)
    ) {
      this.handleJSONRPCResponse(message as TT.JSONRPCResponse);
      return;
    }

    if (message.method && message.params && (message.id === null || message.id === undefined)) {
      this.handleJSONRPCNotification(message as TT.JSONRPCNotification);
      return;
    }
  }

  private handleJSONRPCResponse(response: TT.JSONRPCResponse): void {
    const responseId =
      response.id === null || response.id === undefined ? null : String(response.id);
    const queueItem = this.messageQueue.find((item) => item.id === responseId);
    if (queueItem) {
      this.messageQueue = this.messageQueue.filter((item) => item.id !== responseId);

      if (response.error) {
        queueItem.reject(
          new Error(`JSON-RPC Error ${response.error.code}: ${response.error.message}`),
        );
      } else {
        queueItem.resolve(response.result);
      }
    } else {
    }
  }

  private handleJSONRPCNotification(notification: TT.JSONRPCNotification): void {
    if (
      (notification.method === 'subscription' || notification.method === 'event') &&
      notification.params
    ) {
      const { channel, data } = notification.params as TT.SubscriptionNotificationParams;
      let notificationSent = false;
      this.subscriptions.forEach((subscription, subscriptionId) => {
        if (subscription.channel === channel) {
          const callback = this.subscriptionCallbacks.get(subscriptionId);
          if (callback) {
            callback({
              channel,
              data,
              timestamp: Date.now(),
            });
            notificationSent = true;
          } else {
            console.warn(`No callback found for subscription ${subscriptionId}`);
          }
        }
      });
    } else {
      console.warn(`Unknown notification method: ${notification.method}`);
    }
  }

  private async sendJSONRPCMessage<T>(message: TT.JSONRPCMessage): Promise<T> {
    await this.ensureConnected();

    return new Promise((resolve, reject) => {
      if (message.id === null || message.id === undefined) {
        message.id = (++this.messageIdCounter).toString();
      }

      if (message.id !== undefined) {
        const requestId = String(message.id);
        this.messageQueue.push({
          id: requestId,
          resolve,
          reject,
        });

        if (this.timeout) {
          setTimeout(() => {
            this.messageQueue = this.messageQueue.filter((qm) => qm.id !== requestId);
            reject(new Error('Request timeout'));
          }, this.timeout);
        }
      }

      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket is not connected'));
        return;
      }

      const messageStr = JSON.stringify(message);
      this.ws.send(messageStr);

      if (message.id === undefined) {
        resolve({} as T);
      }
    });
  }

  private formatSubscriptionParams(
    channel: string,
    payload: Record<string, any>,
  ): TT.FlexibleSubscribeParams {
    const payloadObj = payload as Record<string, any>;

    const subscription: TT.StructuredSubscription = {
      channel: channel,
      ...payloadObj,
    };

    // if (payloadObj?.instrumentId || payloadObj?.symbol) {
    //   subscription.symbol = payloadObj.instrumentId || payloadObj.symbol;
    // }

    // if (payloadObj?.user || payloadObj?.account) {
    //   subscription.user = payloadObj.user || payloadObj.account;
    // }

    return subscription;
  }

  private async subscribeToChannels(
    params: TT.FlexibleSubscribeParams,
  ): Promise<TT.SubscribeResult> {
    const message: TT.JSONRPCMessage = {
      jsonrpc: '2.0',
      method: TT.WSMethod.SUBSCRIBE,
      params: params,
      id: (++this.messageIdCounter).toString(),
    };

    return this.sendJSONRPCMessage<TT.SubscribeResult>(message);
  }

  private async unsubscribeFromChannels(channels: string[]): Promise<TT.UnsubscribeResult> {
    const message: TT.JSONRPCMessage = {
      jsonrpc: '2.0',
      method: TT.WSMethod.UNSUBSCRIBE,
      params: channels, // Send channels directly as array, not wrapped in object
      id: (++this.messageIdCounter).toString(),
    };

    return this.sendJSONRPCMessage<TT.UnsubscribeResult>(message);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = this.isTestnet ? this.server.testnet : this.server.mainnet;
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.startKeepAlive();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleIncomingMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          this.cleanup();

          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
              this.reconnectAttempts++;
              this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  async disconnect(): Promise<void> {
    this.cleanup();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  async ping(): Promise<TT.PongResult> {
    await this.ensureConnected();

    const message: TT.JSONRPCMessage = {
      jsonrpc: '2.0',
      method: TT.WSMethod.PING,
      id: (++this.messageIdCounter).toString(),
    };

    return this.sendJSONRPCMessage<TT.PongResult>(message);
  }

  private createAbortError(): Error {
    if (typeof DOMException !== 'undefined') {
      return new DOMException('The operation was aborted', 'AbortError');
    }

    const error = new Error('The operation was aborted');
    error.name = 'AbortError';
    return error;
  }

  private normalizeRequestResult<T>(result: unknown): T {
    if (
      result &&
      typeof result === 'object' &&
      'data' in result &&
      (result as { data?: unknown }).data !== undefined
    ) {
      return (result as { data: T }).data;
    }

    return result as T;
  }

  async request<T>(
    type: 'info' | 'exchange' | 'explorer',
    payload: unknown,
    signal?: AbortSignal,
  ): Promise<T> {
    if (signal?.aborted) {
      throw this.createAbortError();
    }

    const requestId = (++this.messageIdCounter).toString();
    const message: TT.JSONRPCMessage = {
      jsonrpc: '2.0',
      method: TT.WSMethod.POST,
      params: {
        type: type === 'exchange' ? 'action' : type,
        payload,
      },
      id: requestId,
    };

    const requestPromise = this.sendJSONRPCMessage<unknown>(message);

    if (!signal) {
      const result = await requestPromise;
      return this.normalizeRequestResult<T>(result);
    }

    return new Promise<T>((resolve, reject) => {
      const onAbort = () => {
        this.messageQueue = this.messageQueue.filter((item) => item.id !== requestId);
        reject(this.createAbortError());
      };

      signal.addEventListener('abort', onAbort, { once: true });

      requestPromise
        .then((result) => {
          signal.removeEventListener('abort', onAbort);
          resolve(this.normalizeRequestResult<T>(result));
        })
        .catch((error) => {
          signal.removeEventListener('abort', onAbort);
          reject(error);
        });
    });
  }

  async subscribe<T>(
    channel: string,
    payload: unknown,
    listener: (data: CustomEvent<T>) => void,
  ): Promise<T> {
    await this.ensureConnected();

    const subscriptionId = `${channel}_${Date.now()}`;

    const subscription: TT.ISubscription = {
      id: subscriptionId,
      channel,
      symbol:
        (payload as Record<string, any>)?.instrumentId || (payload as Record<string, any>)?.symbol,
      params: payload as Record<string, any>,
      timestamp: Date.now(),
    };

    this.subscriptionCallbacks.set(subscriptionId, (data: TT.ISubscriptionData) => {
      const customEvent = new CustomEvent('subscription', {
        detail: data.data as T,
      }) as CustomEvent<T>;
      listener(customEvent);
    });

    try {
      const subscriptionParams = this.formatSubscriptionParams(channel, payload);

      const result = await this.subscribeToChannels(subscriptionParams);

      if (result.status === 'subscribed' && result.channels && result.channels.length > 0) {
        const serverChannel = result.channels[0];
        subscription.channel = serverChannel;

        this.subscriptions.set(subscriptionId, subscription);

        return { ...result, subscriptionId } as T;
      } else if (result.status === 'failed' || result.status === 'error') {
        this.subscriptionCallbacks.delete(subscriptionId);
        const errorMsg = result.error || `Subscription ${result.status}`;
        throw new Error(`Server rejected subscription: ${errorMsg}`);
      } else if (!result.channels || result.channels.length === 0) {
        this.subscriptionCallbacks.delete(subscriptionId);
        throw new Error(`Server returned no channels for subscription`);
      } else {
        this.subscriptionCallbacks.delete(subscriptionId);
        throw new Error(`Unknown subscription status: ${result.status}`);
      }
    } catch (error) {
      this.subscriptions.delete(subscriptionId);
      this.subscriptionCallbacks.delete(subscriptionId);
      console.error(`Subscription failed for ${channel}:`, error);
      throw error;
    }
  }

  async unsubscribe(subscriptionId: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    try {
      if (this.isConnected()) {
        await this.unsubscribeFromChannels([subscription.channel]);
      }

      this.subscriptions.delete(subscriptionId);
      this.subscriptionCallbacks.delete(subscriptionId);
    } catch (error) {
      console.error(`Failed to unsubscribe from ${subscription.channel}:`, error);
      this.subscriptions.delete(subscriptionId);
      this.subscriptionCallbacks.delete(subscriptionId);
      throw error;
    }
  }

  getSubscriptions(): TT.ISubscription[] {
    return Array.from(this.subscriptions.values());
  }
}
