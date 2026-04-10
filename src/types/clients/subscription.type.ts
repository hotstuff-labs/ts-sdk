import type { ISubscriptionTransport } from "../transports";

export interface ISubscriptionClientParameters<
  T extends ISubscriptionTransport
> {
  transport: T;
}
