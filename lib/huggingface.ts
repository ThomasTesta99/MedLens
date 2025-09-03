export type HFOptions = {
    use_cache?: boolean,
    wait_for_model?: boolean, 
}

function sleep(ms: number) : Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

export async function hfFetch<TJson>(
    url: string, 
    init: RequestInit,
    expect: "json",
    retries?: number, 
): Promise<TJson>;
export async function hfFetch(
    url: string, 
    init: RequestInit,
    expect: "arrayBuffer",
    retries?: number, 
): Promise<ArrayBuffer>;
export async function hfFetch<TJson>(
    url: string, 
    init: RequestInit,
    expect: "json" | "arrayBuffer",
    retries = 2, 
): Promise<TJson | ArrayBuffer>{
    let lastErr: Error | null = null;
    for(let attempt = 0; attempt <= retries; attempt++){
        const res = await fetch(url, init);
        if(res.ok){
            return expect === "json" ? (res.json() as Promise<TJson>) : res.arrayBuffer();
        }
        const body = await res.text().catch(() => "");
        if(res.status === 503 && attempt < retries){
            await sleep(1500);
            continue;
        }
        lastErr = new Error(`HF ${init.method ?? "GET"} ${url} failed ${res.status}: ${body}`);
        break;
    }
    throw lastErr ?? new Error("HF request failed");
}