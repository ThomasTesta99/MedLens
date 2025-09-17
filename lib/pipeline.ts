import { db } from "@/database/drizzle";
import {
  documentEntities,
  documents,
  documentSentences,
  documentSummaries,
  jobs,
} from "@/database/schema";
import { eq } from "drizzle-orm";
import { computeSentenceOffsets, getDocumentText, splitIntoSentences } from "./sentence";
import { extractEntitiesTokenClassification } from "./ner";
import * as Entity from "./entityUtils";
import { summarizeAndSuggest } from "./summarize";

export async function enqueueProcessing(documentId: string): Promise<void> {
    await db.insert(jobs).values([
        { id: crypto.randomUUID(), type: "sentences", payload: JSON.stringify({ documentId }), status: "queued" },
        { id: crypto.randomUUID(), type: "entities", payload: JSON.stringify({ documentId, base: 0 }), status: "queued" },
    ]);
}

export async function runOneJob(): Promise<Entity.Job> {
    console.log("Inside Run one job") 
    const job = await db.query.jobs.findFirst({ 
        where: eq(jobs.status, "queued"), 
        columns: {id: true, type: true, payload: true,} 
    }); 
    if(!job) return {processed: false,}
    console.log(job)
    const jobType = job.type as Entity.JobType;
    const payload = JSON.parse(job.payload) as Partial<Entity.EntitiesPayload> & Partial<Entity.JobPayloadBase>;

    try {
        if (jobType === "sentences") {
            const documentId = payload.documentId!;
            const text = await getDocumentText(documentId);
            const sentences = splitIntoSentences(text);
            const withOffsets = computeSentenceOffsets(text, sentences);
            if (withOffsets.length > 0) {
            await db.insert(documentSentences).values(
                withOffsets.map((s) => ({
                id: crypto.randomUUID(),
                documentId,
                idx: s.idx,
                text: s.text,
                })),
            );
            }
            await db.update(documents).set({ status: "processing" }).where(eq(documents.id, documentId));
        }

        if (jobType === "entities") {
            const docId = payload.documentId!;
            const base = payload.base ?? 0;
            const full = await getDocumentText(docId);
            const segment = Entity.nextSegment(full, base);

            if (segment.text.length > 0) {
            const raw = await extractEntitiesTokenClassification(segment.text) as Entity.RawEnt[];
            let ents = raw
                .map<Entity.Ent | null>((e: Entity.RawEnt) => {
                const oldLabel = e.entity_group ?? e.entity ?? "";

                const norm = Entity.normalizeLabel(oldLabel);
                if (!norm || !Entity.KEEP.has(norm as Entity.Label)) return null;
                
                const score = e.score ?? 0;
                if (score < Entity.CFG.SCORE_MIN) return null;

                const start = e.start + segment.base;
                const end = e.end + segment.base;
                let text = full.slice(start, end);

                if (!Entity.keepByLength(norm, text)) return null;

                const coerced = Entity.coerceMeasurement(norm, text) || norm;
                const label = coerced as Entity.Label;
                if (label === "MEASUREMENT") text = Entity.normalizeMeasurementText(text);
                
                const neg = Entity.isNegated(full, start);
                const unc = !neg && Entity.isUncertain(full, start, end);
                const context: Entity.Ent["context"] = neg ? "negated" : unc ? "uncertain" : "present";
                return { label, text, start, end, score, context };
                })
                .filter((x): x is Entity.Ent => x !== null);

            ents = Entity.expandEligible(full, ents);
            ents = Entity.stitchAcrossLabels(ents);
            ents = Entity.dedupe(ents);
            ents = Entity.polish(full, ents);

            ents.sort((a, b) => b.score - a.score);
            ents = ents.slice(0, Entity.CFG.SEGMENT_CAP);

            if (ents.length > 0) {
                await db.insert(documentEntities).values(
                ents.map((e) => ({
                    id: crypto.randomUUID(),
                    documentId: docId,
                        label: e.label,
                        text: e.text,
                        start: e.start,
                        end: e.end,
                        score: e.score.toFixed(3), 
                    })),
                    )
                    .onConflictDoNothing();
                }
            }

            const madeProgress = segment.nextBase > base;

            if (madeProgress && segment.nextBase < full.length) {
                await db.insert(jobs).values({
                    id: crypto.randomUUID(),
                    type: "entities",
                    payload: JSON.stringify({ documentId: docId, base: segment.nextBase }),
                    status: "queued",
                });
                await db.update(documents).set({ status: "processing" }).where(eq(documents.id, docId));
            } else {
                await db.update(documents).set({ status: "entities_extracted" }).where(eq(documents.id, docId));

                await db.insert(jobs).values({
                    id: crypto.randomUUID(), 
                    type: "summarize",
                    payload: JSON.stringify({documentId: docId}),
                    status: "queued",
                })
            }
        }

 
        if (jobType === "summarize") {

            const docId = payload.documentId!;
            const full = await getDocumentText(docId);

            let sentences = await db.query.documentSentences.findMany({
                where: eq(documentSentences.documentId, docId),
                columns: {idx: true, text: true},
                orderBy: (t, {asc}) => [asc(t.idx)]
            });

            if(sentences.length === 0){
                const raw = splitIntoSentences(full);
                const withOffsets = computeSentenceOffsets(full, raw);
                if (withOffsets.length > 0) {
                    await db.insert(documentSentences).values(
                        withOffsets.map(s => ({
                        id: crypto.randomUUID(),
                        documentId: docId,
                        idx: s.idx,
                        text: s.text,
                        }))
                    );
                    sentences = withOffsets.map(s => ({ idx: s.idx, text: s.text }));
                }
            }

            const entitiesDB = await db.query.documentEntities.findMany({
                where: eq(documentEntities.documentId, docId),
                columns: { label: true, text: true, start: true, end: true, score: true },
                orderBy: (t, {desc}) => [desc(t.score)],
                limit: 200,
            })

            const entities = entitiesDB.map(e => {
                const neg = Entity.isNegated(full, e.start);
                const unc = !neg && Entity.isUncertain(full, e.start, e.end);
                const context: "present" | "negated" | "uncertain" = neg ? "negated" : unc ? "uncertain" : "present";
                return {label: e.label, text: e.text, context};
            });

            const out = await summarizeAndSuggest({
                fullText: full, 
                entities: entities, 
                sentences: sentences,
            });

            await db.insert(documentSummaries).values({
                id: crypto.randomUUID(),
                documentId: docId, 
                summary: out.summary, 
                questions: JSON.stringify(out.questions), 
                citations: out.citations
            })
        }

        await db.update(jobs).set({ status: "finished" }).where(eq(jobs.id, job.id));
        return { processed: true, jobType: jobType };
    } catch (error) {
    await db.update(jobs).set({ status: "error", error: String(error) }).where(eq(jobs.id, job.id));
    return { processed: false, jobType: jobType, error: String(error) };
    }
}
