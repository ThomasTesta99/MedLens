import { hfFetch, HFOptions } from "./huggingface";


export interface HFTokenEntity {
  start: number;
  end: number;
  score: number;
  entity_group?: string;
  entity?: string;
  word?: string;
  text?: string;
}

type HFTokenResponse = HFTokenEntity[] | HFTokenEntity[][];

function flattenNER(resp: HFTokenResponse): HFTokenEntity[] {
  return Array.isArray(resp[0])
    ? (resp as HFTokenEntity[][]).flat()
    : (resp as HFTokenEntity[]);
}

export async function extractEntitiesTokenClassification(
  text: string,
  opts?: { model?: string; options?: HFOptions }
): Promise<HFTokenEntity[]> {
  const model = opts?.model ?? "dslim/bert-base-NER";
  const url = `https://api-inference.huggingface.co/models/${encodeURI(model)}`;

  const body = {
    inputs: text,
    parameters: { aggregation_strategy: "simple" as const },
    options: { wait_for_model: true, use_cache: true, ...(opts?.options ?? {}) },
  };
  
  const resp = await hfFetch<HFTokenResponse>(
    url,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    "json",
    4,          
    60000       
  );

  const flat = flattenNER(resp).filter(
    (e) => Number.isFinite(e.start) && Number.isFinite(e.end) && e.end > e.start
  );

  return flat.map((e) => ({
    ...e,
    text: e.text ?? (e.word ?? "").replaceAll("##", ""),
  }));
}
