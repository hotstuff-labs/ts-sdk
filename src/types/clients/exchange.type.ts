import type { IRequestTransport, IMaybePromise } from "../transports";

export interface IExchangeClientParameters<T extends IRequestTransport, W> {
  transport: T;
  wallet: W;
  nonce?: () => IMaybePromise<number>;
}

export interface ISuccessResponse {
  status: "ok";
  response: {
    type: "default";
  };
}

export interface IActionRequest {
  action: string;
  params: Record<string, any>;
  opts?: any;
}
