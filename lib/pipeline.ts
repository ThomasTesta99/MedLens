import { db } from "@/database/drizzle";
import {
  documentEntities,
  documents,
  documentSentences,
  jobs,
} from "@/database/schema";
import { eq } from "drizzle-orm";
import { computeSentenceOffsets, getDocumentText, splitIntoSentences } from "./sentence";
import { extractEntitiesTokenClassification } from "./ner";
import { CFG, coerceMeasurement, dedupe, Ent, EntitiesPayload, expandEligible, isNegated, isUncertain, Job, JobPayloadBase, JobType, KEEP, keepByLength, Label, nextSegment, normalizeLabel, normalizeMeasurementText, polish, RawEnt, stitchAcrossLabels } from "./entityUtils";

export async function enqueueProcessing(documentId: string): Promise<void> {
  await db.insert(jobs).values([
    { id: crypto.randomUUID(), type: "sentences", payload: JSON.stringify({ documentId }), status: "queued" },
    { id: crypto.randomUUID(), type: "entities", payload: JSON.stringify({ documentId, base: 0 }), status: "queued" },
  ]);
}

export async function runOneJob(): Promise<Job> {
    console.log("Inside Run one job") 
    const job = await db.query.jobs.findFirst({ 
        where: eq(jobs.status, "queued"), 
        columns: {id: true, type: true, payload: true,} 
    }); 
    if(!job) return {processed: false,}
    console.log(job)
    const jobType = job.type as JobType;
    const payload = JSON.parse(job.payload) as Partial<EntitiesPayload> & Partial<JobPayloadBase>;

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
            const segment = nextSegment(full, base);

            if (segment.text.length > 0) {
            const raw = await extractEntitiesTokenClassification(segment.text) as RawEnt[];
            let ents = raw
                .map<Ent | null>((e: RawEnt) => {
                const oldLabel = e.entity_group ?? e.entity ?? "";
                const norm = normalizeLabel(oldLabel);
                if (!norm || !KEEP.has(norm as Label)) return null;
                const score = e.score ?? 0;
                if (score < CFG.SCORE_MIN) return null;
                const start = e.start + segment.base;
                const end = e.end + segment.base;
                let text = full.slice(start, end);
                if (!keepByLength(norm, text)) return null;
                const coerced = coerceMeasurement(norm, text) || norm;
                const label = coerced as Label;
                if (label === "MEASUREMENT") text = normalizeMeasurementText(text);
                const neg = isNegated(full, start);
                const unc = !neg && isUncertain(full, start, end);
                const context: Ent["context"] = neg ? "negated" : unc ? "uncertain" : "present";
                return { label, text, start, end, score, context };
                })
                .filter((x): x is Ent => x !== null);

            ents = expandEligible(full, ents);
            ents = stitchAcrossLabels(ents);
            ents = dedupe(ents);
            ents = polish(full, ents);

            ents.sort((a, b) => b.score - a.score);
            ents = ents.slice(0, CFG.SEGMENT_CAP);

            if (ents.length > 0) {
                await db.insert(documentEntities).values(
                ents.map((e) => ({
                    id: crypto.randomUUID(),
                    documentId: docId,
                        label: e.label,
                        text: e.text,
                        start: e.start,
                        end: e.end,
                        score: e.score.toFixed(3), // consider numeric column in schema
                    })),
                    )
                    .onConflictDoNothing(); // requires a unique index, see note below
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
            }
        }

 
        if (jobType === "summarize") {
        // Implement summarizer here when ready.
        }

        await db.update(jobs).set({ status: "finished" }).where(eq(jobs.id, job.id));
        return { processed: true, jobType: jobType };
    } catch (error) {
    await db.update(jobs).set({ status: "error", error: String(error) }).where(eq(jobs.id, job.id));
    return { processed: false, jobType: jobType, error: String(error) };
    }
}
