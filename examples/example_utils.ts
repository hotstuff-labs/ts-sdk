import { privateKeyToAccount } from "viem/accounts";
import { CREDENTIALS } from "./credentials.ts";
import {
    ExchangeClient,
    HttpTransport,
    InfoClient,
    SubscriptionClient,
    WebSocketTransport,
} from "../src/index.ts";




type SubscriptionResult = { unsubscribe: () => Promise<void> };


export function msFromNow(minutes = 60): number {
    return Date.now() + minutes * 60_000;
}

export function setupInfoClient({ isTestnet = true }: { isTestnet?: boolean }) {
    const transport = new HttpTransport({ isTestnet: isTestnet ?? true });
    const info = new InfoClient({ transport });
    return { info, transport };
}

export function setupExchangeClient({ isTestnet = true }: { isTestnet?: boolean }) {
    const transport = new HttpTransport({ isTestnet: isTestnet ?? true });
    const account = privateKeyToAccount(CREDENTIALS.MAIN_ACCOUNT_PRIVATE_KEY);

    const exchange = new ExchangeClient({
        transport,
        wallet: account,
    });

    return { exchange, transport, account };
}

export function setupTradingClient({ isTestnet = true }: { isTestnet?: boolean }) {
    const transport = new HttpTransport({ isTestnet: isTestnet ?? true });
    const account = privateKeyToAccount(CREDENTIALS.AGENT_PRIVATE_KEY);

    const exchange = new ExchangeClient({
        transport,
        wallet: account,
    });

    return { exchange, transport, account };
}

export function setupSubscriptionClient({ isTestnet = true }: { isTestnet?: boolean }) {
    const transport = new WebSocketTransport({ isTestnet: isTestnet ?? true, autoConnect: true });
    const subscriptions = new SubscriptionClient({ transport });
    return { subscriptions, transport };
}

export function buildListener(channelName: string) {
    return (event: CustomEvent<unknown>) => {
        console.log(`[${channelName}]`, JSON.stringify(event.detail, null, 2));
    };
}

export async function waitForUpdates(seconds = 20): Promise<void> {
    console.log(`Listening for ${seconds}s. Press Ctrl+C to stop early.`);
    await new Promise((resolve) => setTimeout(resolve, seconds * 1_000));
}

export async function cleanupSubscriptions(
    activeSubscriptions: SubscriptionResult[],
    transport: WebSocketTransport,
): Promise<void> {
    for (const subscription of activeSubscriptions) {
        try {
            await subscription.unsubscribe();
        } catch (error) {
            console.warn("[examples] Failed to unsubscribe cleanly:", error);
        }
    }

    await transport.disconnect();
}

export function printJson(label: string, value: unknown): void {
    console.log(`${label}\n${JSON.stringify(value, null, 2)}\n`);
}
