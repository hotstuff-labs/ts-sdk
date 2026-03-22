export const ENDPOINTS_URLS = {
  mainnet: {
    api: "https://api.hotstuff.trade/",
    rpc: "https://api.hotstuff.trade/",
    ws: "wss://api.hotstuff.trade/ws/",
  },
  testnet: {
    api: "https://testnet-test-api.hotstuff.exchange/",
    rpc: "https://testnet-test-api.hotstuff.exchange/",
    ws: "wss://testnet-test-api.hotstuff.exchange/ws/",
  },
};

export function mergeRequestInit(...inits: RequestInit[]): RequestInit {
  const merged = inits.reduce((acc, init) => ({ ...acc, ...init }), {});

  const headersList = inits
    .map((init) => init.headers)
    .filter((headers) => typeof headers === "object");
  if (headersList.length > 0) {
    merged.headers = mergeHeadersInit(...headersList);
  }

  const signals = inits
    .map((init) => init.signal)
    .filter((signal) => signal instanceof AbortSignal);
  if (signals.length > 0) {
    merged.signal = signals.length > 1 ? AbortSignal.any(signals) : signals[0];
  }

  return merged;
}

function mergeHeadersInit(...inits: HeadersInit[]): Headers {
  if (inits.length === 0 || inits.length === 1) {
    return new Headers(inits[0] as HeadersInit | undefined);
  }

  const merged = new Headers();
  for (const headers of inits) {
    if (Symbol.iterator in headers) {
      for (const [key, value] of headers as Iterable<[string, string]>) {
        merged.set(key, value);
      }
    } else {
      for (const key in headers as Record<string, string>) {
        if (headers.hasOwnProperty(key)) {
          merged.set(key, (headers as Record<string, string>)[key]);
        }
      }
    }
  }
  return merged;
}
