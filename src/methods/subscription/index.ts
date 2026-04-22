export * as GlobalSubscriptionMethods from "./global.method";
export * as AccountSubscriptionMethods from "./account.method";
import type {
  IWSTicker,
  IWSOrderbook,
  IWSChart,
  IWSTrade,
} from "./global.method";
import type { IWSOrder, IWSFill } from "./account.method";

export type { IWSTicker, IWSOrderbook, IWSChart, IWSTrade, IWSOrder, IWSFill };
