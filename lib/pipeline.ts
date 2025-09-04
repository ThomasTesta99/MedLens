import { db } from "@/database/drizzle";
import { documentEntities, documents, documentSentences, documentSummaries, documentTexts, jobs } from "@/database/schema";
import { asc, eq } from "drizzle-orm";
import { splitIntoSentences } from "./sentence";
import { extractEntitiesTokenClassification } from "./ner";
import { generateSuggestedQuestions, summarizeReport } from "./summarize";
import { buildSentenceCitations } from "./citations";

export async function enqueueProcessing(documentId: string) : Promise<void>{
    await db.insert(jobs).values([
        {id: crypto.randomUUID(), type: "sentences", payload: JSON.stringify({documentId}), status: "queued"},
        {id: crypto.randomUUID(), type: "entities", payload: JSON.stringify({documentId, base: 0}), status: "queued"},
        //{id: crypto.randomUUID(), type: "summarize", payload: JSON.stringify({documentId}), status: "queued"},

    ])
}

export type JobType = "sentences" | "entities" | "summarize";

interface JobPayload {
    documentId: string
}

export type Job = { 
    processed: boolean, 
    jobType?: JobType,
    error?: string
}

interface EntitiesPayload extends JobPayload { base?: number }

function nextSegment(
    full: string, 
    base: number, 
    maxChars = 900
) : {text: string, base: number, nextBase: number} {
    const n = full.length;
    if(base >= n) return {text: "", base, nextBase: base};
    const hardEnd = Math.min(n, base + maxChars);

    let end = hardEnd;
    if(end < n) {
        const lastSpace = full.lastIndexOf(" ", end);
        if(lastSpace > base + 200 ) end = lastSpace;
    }
    const slice = full.slice(base, end).trim();
    let nextBase = end;
    while(nextBase < n && /\s/.test(full[nextBase] ?? "")) nextBase++;

    return {
        text: slice, 
        base, 
        nextBase,
    }
}

async function getDocumentText(documentId: string) : Promise<string> {
    const row = await db.query.documentTexts.findFirst({
        where: eq(documentTexts.documentId, documentId),
    })
    if(!row) throw new Error("Document texts not found");
    return row.plainText;
}

export async function runOneJob() : Promise<Job> {
    console.log("Inside Run one job")
    const job = await db.query.jobs.findFirst({
        where: eq(jobs.status, "queued"),
        columns: {id: true, type: true, payload: true,}
    });
    if(!job) return {processed: false,}
    console.log("Got the jobs: ", job);
    const jobType = job.type as JobType;
    await db.update(jobs).set({status: "running"}).where(eq(jobs.id, job.id));

    try {
        const {documentId} = JSON.parse(job.payload) as JobPayload;
        if(jobType === "sentences"){
            console.log("Sentences");
            const text = await getDocumentText(documentId);
            const sentences = splitIntoSentences(text);
            if(sentences.length > 0){
                await db.insert(documentSentences).values(
                    sentences.map((s, i) => ({
                        id: crypto.randomUUID(), 
                        documentId, 
                        idx: i, 
                        text: s,
                    }))
                );
            }
            await db.update(documents).set({status: "processing"}).where(eq(documents.id, documentId));
        }

        if(jobType === "entities"){
            console.log("entities")
            const {documentId: docId, base = 0} = JSON.parse(job.payload) as EntitiesPayload;
            const full = await getDocumentText(docId);
            
            const segment = nextSegment(full, base, 900);
            console.log("CURRENT SEGMENT: ", segment);
            if(segment.text.length > 0){
                console.log("trying to get entities")
                const entities = await extractEntitiesTokenClassification(segment.text);
                console.log("i got some entities");
                if(entities.length > 0){
                    await db.insert(documentEntities).values(
                        entities.map((e) => ({
                            id: crypto.randomUUID(),
                            documentId: docId,
                            label: (e.entity_group ?? e.entity ?? "ENTITY").toUpperCase(),
                            text: full.slice(e.start + segment.base, e.end + segment.base),
                            start: e.start + segment.base,
                            end: e.end + segment.base,
                            score: e.score.toFixed(3),
                        }))
                    )
                }
            }
            console.log("Adding new job")
            if(segment.nextBase < full.length){
                await db.update(jobs).set({status: "Finished"}).where(eq(jobs.id, job.id));
                await db.insert(jobs).values({
                    id: crypto.randomUUID(),
                    type: "entities",
                    payload: JSON.stringify({documentId, base: segment.nextBase}),
                    status: "queued",
                });
                await db.update(documents).set({status: "processing"}).where(eq(documents.id, documentId));
            }else{
                await db.update(documents).set({status: "entities_extracted"}).where(eq(documents.id, documentId));

                await db.insert(jobs).values({
                    id: crypto.randomUUID(),
                    type: "summarize",
                    payload: JSON.stringify({documentId}),
                    status: "queued",
                })
            }
            
        }

        if(jobType === "summarize"){
            console.log("summaries");
            const text = await getDocumentText(documentId);
            const [sumamry, questions] = await Promise.all([
                summarizeReport(text),
                generateSuggestedQuestions(text, 5)
            ]);
            
            const sentences = await db.query.documentSentences.findMany({
                where: eq(documentSentences.documentId, documentId),
                orderBy: (t) => [asc(t.idx)],
            })

            const sourceSentences = sentences.map(s => s.text);
            const citations = buildSentenceCitations(sumamry, sourceSentences, 2);

            await db.insert(documentSummaries).values([
                {
                    id: crypto.randomUUID(),
                    documentId, 
                    summaryMd: sumamry, 
                    citations,
                },
                {
                    id: crypto.randomUUID(),
                    documentId, 
                    summaryMd: questions,
                    citations: [],
                }
            ])

            await db.update(documents).set({status: "summarized"}).where(eq(documents.id, documentId));
        }
        await db.update(jobs).set({status: "Finished"}).where(eq(jobs.id, job.id));
        return {
            processed: true, 
            jobType: jobType,
        }
    } catch (error) {
        await db.update(jobs).set({status: "error", error: String(error)}).where(eq(jobs.id, job.id));
        return {
            processed: false, 
            jobType: jobType,
            error: error as string
        }
    }
}