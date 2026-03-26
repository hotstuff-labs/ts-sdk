import type { TradingExchangeMethods as TM } from "../src/methods/index.ts";

import {
    BROKER_ADDRESS,
    msFromNow,
    printJson,
    setupTradingClient,
} from "./example_utils.ts";

function placeOrderPayload(): TM.IPlaceOrderMethodParams {
    return {
        orders: [
            {
                instrumentId: 1,
                side: "b",
                positionSide: "BOTH",
                price: "100",
                size: "0.01",
                tif: "GTC",
                ro: false,
                po: false,
                cloid: `ts-order-${Date.now()}`,
            },
        ],
        expiresAfter: msFromNow(60),
    };
}

function placeOrderPayloadWithNonce(): TM.IPlaceOrderMethodParams {
    return {
        orders: [
            {
                instrumentId: 1,
                side: "b",
                positionSide: "BOTH",
                price: "100",
                size: "0.01",
                tif: "GTC",
                ro: false,
                po: false,
                cloid: `ts-order-nonce-${Date.now()}`,
            },
        ],
        nonce: 1234567890,
        expiresAfter: msFromNow(60),
    };
}

function placeOrderPayloadWithBrokerConfig(): TM.IPlaceOrderMethodParams {
    return {
        orders: [
            {
                instrumentId: 1,
                side: "b",
                positionSide: "BOTH",
                price: "100",
                size: "0.01",
                tif: "GTC",
                ro: false,
                po: false,
                cloid: `ts-order-broker-${Date.now()}`,
            },
        ],
        brokerConfig: {
            broker: BROKER_ADDRESS,
            fee: "0.001",
        },
        expiresAfter: msFromNow(60),
    };
}

async function main() {
    console.log("--------------------------------\nPlace order\n");
    const { exchange } = setupTradingClient({ isTestnet: true });

    // const result = await exchange.placeOrder(placeOrderPayload());
    // const result = await exchange.placeOrder(placeOrderPayloadWithBrokerConfig());
    const result = await exchange.placeOrder(placeOrderPayloadWithNonce());

    printJson("Order placed successfully! Response:", result);
}

main().catch((error) => {
    console.error(error);
});
