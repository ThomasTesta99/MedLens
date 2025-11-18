
export type SummarizeOut = {
  summary: string;
  questions: string[];
  citations: Array<{ sentenceIdx: number; sourceSentenceIdxes: number[] }>;
};

export async function summarizeAndSuggest({
    fullText,
    entities,
    sentences,
    model = "gemini-2.5-flash",
}:{
    fullText: string,
    entities: Array<{ label: string; text: string; context: "present"|"negated"|"uncertain" }>;
    sentences: Array<{ idx: number; text: string }>;
    model?: string;
}): Promise<SummarizeOut>{
    const system = `
    You explain imaging reports to patients.

    Rules:
    - Use only the SENTENCES as evidence; do not invent facts.
    - Focus on what was checked, what was normal, what was abnormal, and the overall impression.
    - Avoid dates, scheduling, fasting instructions, doses, or machine details unless they change the meaning of the results.
    - Write at about a 6th-grade level, expand abbreviations, and explain medical terms; mark negated/uncertain findings.
    - Summarize in 10 - 12 sentences. Use more sentences if you can not caputre essential information in 10 - 12 sentences.
    - Then give 5 - 10 questions the patient should ask the doctor about these findings and next steps.
    - Return strict JSON with: summary, questions, citations (summary sentence index → document sentence indices).
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
        throw new Error(`${await res.text()}`);
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