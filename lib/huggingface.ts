
export type HFOptions = { use_cache?: boolean; wait_for_model?: boolean };

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);


export async function hfFetch<TJson>(
  url: string,
  init: RequestInit,
  expect: "json",
  retries?: number,
  requestTimeoutMs?: number
): Promise<TJson>;
export async function hfFetch(
  url: string,
  init: RequestInit,
  expect: "arrayBuffer",
  retries?: number,
  requestTimeoutMs?: number
): Promise<ArrayBuffer>;

export async function hfFetch<TJson>(
  url: string,
  init: RequestInit,
  expect: "json" | "arrayBuffer",
  retries = 3,
  requestTimeoutMs = 30000
): Promise<TJson | ArrayBuffer> {
  let attempt = 0;
  let lastErr: Error | null = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), requestTimeoutMs);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);

      if (res.ok) {
        return expect === "json" ? (res.json() as Promise<TJson>) : res.arrayBuffer();
      }

      const status = res.status;
      const body = await res.text().catch(() => "");
      if (RETRYABLE.has(status) && attempt < retries) {
        const backoffMs = Math.min(2000 * Math.pow(1.6, attempt), 10000);
        await sleep(backoffMs);
        attempt += 1;
        continue;
      }

      lastErr = new Error(`HF ${init.method ?? "GET"} ${url} failed ${status}: ${body.slice(0, 300)}`);
      break;
    } catch (e) {
      clearTimeout(timer);
      
      if (attempt < retries) {
        const backoffMs = Math.min(2000 * Math.pow(1.6, attempt), 10000);
        await sleep(backoffMs);
        attempt += 1;
        continue;
      }
      lastErr = e instanceof Error ? e : new Error("HF fetch failed");
      break;
    }
  }

  throw lastErr ?? new Error("HF fetch failed");
}
