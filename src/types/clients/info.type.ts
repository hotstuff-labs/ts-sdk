import type { IRequestTransport } from "../transports";

export interface IInfoClientParameters<T extends IRequestTransport> {
  transport: T;
}
