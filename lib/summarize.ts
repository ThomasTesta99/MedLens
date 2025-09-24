import { GeminiResponse } from "@/types/types";

export type SummarizeOut = {
  summary: string;
  questions: string[];
  citations: Array<{ sentenceIdx: number; sourceSentenceIdxes: number[] }>;
};

export async function summarizeAndSuggest({
    fullText,
    entities,
    sentences,
    model = "gemini-1.5-flash",
}:{
    fullText: string,
    entities: Array<{ label: string; text: string; context: "present"|"negated"|"uncertain" }>;
    sentences: Array<{ idx: number; text: string }>;
    model?: string;
}): Promise<SummarizeOut>{
    const system =
    `You are a medical-report explainer for paitents.
    Rules:
    - Use only the provides SENTENCES as evidence, do NOT invent facts.
    - Write in plain English at roughly a 6th-grade reading level.
    - Expand abbreviations and avoid jargon; mark negated/uncertain items if present.
    - Produce a concise summary of 6 - 8 sentences. Extend beyond this range only if essential information cannot be captured within 6 - 8 sentences, and avoid repetition.
    - Generate 5 - 10 specific questions the patient should ask the doctor.
    - Return STRICT JSON matching the provided chema.
    - Provide citations: for ALL summary sentence(0-based), list the indices of source SENTENCES that support it.
    `.trim();

    const sentenceBlock = sentences.map(s => `[${s.idx}] ${s.text}`).join("\n");
    const entitiesBlock =- entities.slice(0, 200).map(e => `- ${e.label} | ${e.text} | ${e.context}`).join("\n");

    const user = `
    REPORT TEXT (context only; cite from sentences):
    """${fullText.slice(0, 5000)}"""

    EXTRACTED ENTITIES:
    ${entitiesBlock}

    SENTENCES (use ONLY these for evidence; cite by index):
    ${sentenceBlock}

    Return ONLY valid JSON:
    {
        "summary": "string",
        "questions": ["string", "..."],
        "citations": [
            {"sentenceIdx": 0, "sourceSentenceIdxes": [0,1]},
            {"sentenceIdx": 1, "sourceSentenceIdxes": [2]}
        ]
    }
    - Do NOT include [n] or [n, m] anywhere in "summary".
    - "sentenceIdx" refers to the sentence index after we split "summary" into sentences.
    - "sourceSentenceIdxes" must match the provided document sentence indices (not positions).
    `.trim();

    const response_schema = {
        type: "object",
        properties: {
            summary: { type: "string" },
            questions: { type: "array", items: { type: "string" } },
            warnings: { type: "array", items: { type: "string" } },
            grade_level: { type: "integer" },
            citations: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        sentenceIdx: { type: "integer" },
                        sourceSentenceIdxes: {
                        type: "array",
                        items: { type: "integer" },
                        },
                    },
                    required: ["sentenceIdx", "sourceSentenceIdxes"],
                },
            },
        },
        required: ["summary", "questions", "citations"],
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURI(model)}:generateContent?key=${encodeURI(process.env.GOOGLE_GEMINI_API_KEY!)}`
    const body = {
        contents: [{role: 'user', parts: [{text: `${system}\n\n${user}`}]}],
        generation_config: {
            temperature: 0.2,
            response_mime_type: "application/json",
            response_schema
        }
    }

    const res = await fetch(
        url,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        }
    );

    if (!res.ok) {
        throw new Error(`HF API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();

    const raw =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ??
    "";

    if (typeof raw !== "string" || raw.trim().length === 0) {
        throw new Error("Gemini returned empty response");
    }

    let out: SummarizeOut;
    try {
        out = JSON.parse(raw) as SummarizeOut;
    } catch {
        const maybeJson = raw.match(/\{[\s\S]*\}$/)?.[0] ?? raw;
        out = JSON.parse(maybeJson) as SummarizeOut;
    }

    out.citations = Array.isArray(out.citations)
        ? out.citations
            .map((c) => ({
            sentenceIdx:
                typeof c.sentenceIdx === "number" && c.sentenceIdx >= 0 ? c.sentenceIdx : 0,
            sourceSentenceIdxes: Array.isArray(c.sourceSentenceIdxes)
                ? c.sourceSentenceIdxes.filter((n) => Number.isInteger(n) && n >= 0)
                : [],
            }))
            .filter((c) => c.sourceSentenceIdxes.length > 0)
        : [];

    return out;

}