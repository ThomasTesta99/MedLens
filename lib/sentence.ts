import { db } from "@/database/drizzle";
import { documentTexts } from "@/database/schema";
import { eq } from "drizzle-orm";

export function splitIntoSentences(text: string): string[] {
    const raw = text.replace(/\+/g, " ").trim().split(/(?<=[.!?])\s+(?=[A-Z(])/)
    return raw.map(s => s.trim()).filter(s => s.length > 0);
}

export function toNumberedLines(summary: string): { numbered: string; sentences: string[] } {
  const sentences = summary
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z(0-9])/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  const numbered = sentences.map((s, i) => `${i + 1}) ${s}`).join("\n");
  return { numbered, sentences };
}

export async function getDocumentText(documentId: string): Promise<string> {
  const row = await db.query.documentTexts.findFirst({
    where: eq(documentTexts.documentId, documentId),
  });
  if (!row) throw new Error("Document texts not found");
  return row.plainText;
}

export function computeSentenceOffsets(full: string, sentences: string[]) {
  const out: { text: string; start: number; end: number; idx: number }[] = [];
  let cursor = 0;
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i].trim();
    if (!s) continue;
    const pos = full.indexOf(s, cursor);
    if (pos === -1) continue;
    out.push({ text: s, start: pos, end: pos + s.length, idx: i });
    cursor = pos + s.length;
  }
  return out;
}