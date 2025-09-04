import { hfFetch } from "./huggingface";

interface HFSummaryItem{
    summary_text: string,
}

interface HFTextToTextItem{
    generated_text: string, 
}

export async function summarizeReport(
    text: string, 
    charBuget = 6000,
): Promise<string>{
    const clipped = text.slice(0, charBuget);
    const url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

    const body = {
        inputs: clipped,
        parameters: {max_length: 220, min_length: 90, do_sample: false},
        options: {wait_for_model : true},
    };

    const out = await hfFetch<HFSummaryItem[]>(
        url, 
        {
            method: "POST",
            headers:{
                Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY!}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        },
        "json",
        2,
    );

    if(Array.isArray(out) && out[0]?.summary_text) return out[0].summary_text.trim();
    return JSON.stringify(out);
}

export async function generateSuggestedQuestions(
    text: string, 
    maxQuestions = 5
) : Promise<string> {
    const url = "https://api-inference.huggingface.co/models/google/flan-t5-base";
    const prompt = 
    `Given the following medical report text, list ${maxQuestions} throughful, patient-friendly questions to ask the doctor.\n` + 
    `Return them a simple numbered list without extra commentary.\n\n` + 
    `TEXT:\n${text.slice(0, 4000)}`;

    const out = await hfFetch<HFTextToTextItem[]>(
        url, 
        {
            method: "POST",
            headers:{
                Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY!}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt, 
                parameters: { max_new_tokens: 200, temperature: 0.3 },
                options: {wait_for_model: true},
            }),
        },
        "json",
        2,
    );

    const txt = Array.isArray(out) && out[0]?.generated_text ? out[0].generated_text : '';
    return txt.trim();
}