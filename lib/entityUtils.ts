// ──────────────────────────────────────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────────────────────────────────────

export const CFG = {
  SCORE_MIN: 0.8,
  SEGMENT_MAX_CHARS: 900,
  SEGMENT_OVERLAP: 60,
  SEGMENT_CAP: 30,
} as const;

export type Label =
  | "DISEASE"
  | "FINDING"
  | "ANATOMY"
  | "TEST"
  | "PROCEDURE"
  | "MEASUREMENT"
  | "SEVERITY"
  | "DOSAGE"
  | "MEDICATION";

export const KEEP: ReadonlySet<Label> = new Set([
  "DISEASE",
  "FINDING",
  "ANATOMY",
  "TEST",
  "PROCEDURE",
  "MEASUREMENT",
  "SEVERITY",
  "DOSAGE",
  "MEDICATION",
]);

export const PRECEDENCE_ORDER: Record<Label, number> = {
  DISEASE: 0,
  FINDING: 1,
  ANATOMY: 2,
  MEASUREMENT: 3,
  TEST: 4,
  PROCEDURE: 5,
  SEVERITY: 6,
  DOSAGE: 7,
  MEDICATION: 8,
};

export type JobType = "sentences" | "entities" | "summarize";

export interface JobPayloadBase { documentId: string }
export interface EntitiesPayload extends JobPayloadBase { base?: number }

export type Job = { processed: boolean; jobType?: JobType; error?: string, nextJobType?: JobType};

// ──────────────────────────────────────────────────────────────────────────────
// HELPERS – Entities
// ──────────────────────────────────────────────────────────────────────────────

export const MODALITIES = new Set(["CT","MR","PET","US","XR"]);
export const FINDING_HEADS = new Set([
  "effusion","opacity","nodule","atelectasis","consolidation","lesion","pneumothorax","pneumonia","spiculation"
]);
export const ANAT_ADJ = /^(pleural|pericardial|pulmonary|endobronchial|mediastinal)$/i;

export type Ent = {
  text: string;
  start: number;
  end: number;
  score: number;
  label: Label;
  sentIdx?: number;
  context: "present" | "negated" | "uncertain";
};

export type RawEnt = {
  start: number;
  end: number;
  score?: number;
  entity_group?: string;
  entity?: string;
  word?: string;
};

export const tinyLower = (s: string) => /^[a-z]{1,3}$/.test(s);
export const numberish = (s: string) => /^\d+(\.\d+)?$/.test(s);
export const unitish   = (s: string) => /^(mm|cm|mL|mg)$/i.test(s);
export const hyphenEnd = (s: string) => /[-–—]\s*$/.test(s);
export const punctOnly = (s: string) => /^[\/]+$/.test(s.trim());

export function chooseLabel(a: Label, b: Label): Label {
  return PRECEDENCE_ORDER[a] <= PRECEDENCE_ORDER[b] ? a : b;
}

export function canJoin(prev: Ent, cur: Ent) {
  const gap = cur.start - prev.end;
  if (gap < 0 || gap > 2) return false;

  if (numberish(prev.text) && unitish(cur.text)) return true;
  if (hyphenEnd(prev.text)) return true;
  if (prev.text.endsWith("/")) return true;
  if (punctOnly(cur.text)) return true;
  if (tinyLower(prev.text) || tinyLower(cur.text)) return true;

  if (MODALITIES.has(prev.text.toUpperCase()) && MODALITIES.has(cur.text.toUpperCase())) return true;

  if (ANAT_ADJ.test(prev.text) && FINDING_HEADS.has(cur.text.toLowerCase())) return true;

  return false;
}

export function joinText(a: string, b: string) {
  if (numberish(a) && unitish(b)) return a + b;
  if (hyphenEnd(a)) return (a + b).replace(/\s+/g, "");
  if (a.endsWith("/")) return (a + b).replace(/\s+/g, "");
  if (punctOnly(b)) return (a + b).replace(/\s+/g, "");
  if (tinyLower(a) || tinyLower(b)) return (a + b).replace(/\s+/g, "");

  if (MODALITIES.has(a.toUpperCase()) && MODALITIES.has(b.toUpperCase())) return `${a}/${b}`.replace(/\s+/g, "");

  if (ANAT_ADJ.test(a) && FINDING_HEADS.has(b.toLowerCase())) return `${a} ${b}`;

  return a + " " + b;
}


export function stitchAcrossLabels(ents: Ent[]): Ent[] {
  if (!ents.length) return [];
  ents.sort((x, y) => x.start - y.start);
  const out: Ent[] = [];
  for (const cur of ents) {
    const last = out[out.length - 1];
    if (last && canJoin(last, cur)) {
      const wasAdjHead = ANAT_ADJ.test(last.text) && FINDING_HEADS.has(cur.text.toLowerCase());
      last.text  = joinText(last.text, cur.text);
      last.end   = cur.end;
      last.score = Math.max(last.score, cur.score);
      last.label = wasAdjHead ? "FINDING" : chooseLabel(last.label, cur.label);
    } else {
      out.push({ ...cur });
    }
  }
  for (const e of out) e.text = e.text.replace(/\s{2,}/g, " ").trim();
  return out;
}


export function dedupe<T extends { text: string; start: number; end: number; label: string }>(ents: T[]) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const e of ents) {
    const key = e.label + "|" + e.text.toLowerCase() + "|" + e.start + "|" + e.end;
    if (!seen.has(key)) { seen.add(key); out.push(e); }
  }
  return out;
}

export function keepByLength(_label: string, text: string) {
  const t = text.trim();
  const whiteList = new Set(["mm", "cm", "mL", "CT", "MR", "PET", "LDCT"]);
  if (whiteList.has(t)) return true;
  if (/^\d+(\.\d+)?$/.test(t)) return true;
  if (t.length < 3 && /^[a-z]+$/.test(t)) return false;
  return true;
}

export function normalizeMeasurementText(t: string) {
  return t.replace(/\b\.(\d)/g, "0.$1");
}

export function coerceMeasurement(label: string, text: string): Label | "" {
  return /\b\d+(\.\d+)?\s?(mm|cm)\b/i.test(text) ? "MEASUREMENT" : (label as Label | "");
}

export function normalizeLabel(label?: string): Label | "" {
  const str = (label ?? "").toUpperCase();
  if (str.includes("DISEASE") || str.includes("DISORDER")) return "DISEASE";
  if (str.includes("SYMPTOM") || str.includes("FINDING")) return "FINDING";
  if (str.includes("ANATOMY") || str.includes("BODY") || str.includes("BIOLOGICAL_STRUCTURE")) return "ANATOMY";
  if (str.includes("DRUG") || str.includes("CHEMICAL") || str.includes("MED")) return "MEDICATION";
  if (str.includes("TEST") || str.includes("DIAGNOSTIC_PROCEDURE") || str.includes("LAB")) return "TEST";
  if (str.includes("PROC")) return "PROCEDURE";
  if (str.includes("DISTANCE") || str.includes("SIZE")) return "MEASUREMENT";
  if (str.includes("SEVERITY")) return "SEVERITY";
  if (str.includes("DOSAGE") || str.includes("ADMINISTRATION")) return "DOSAGE";
  return "";
}

export function expandToWordBoundaries(full: string, start: number, end: number) {
  let s = start, e = end;
  const rx = /[A-Za-z0-9.]/;
  while (s > 0 && rx.test(full[s - 1])) s--;
  while (e < full.length && rx.test(full[e])) e++;
  return { start: s, end: e, text: full.slice(s, e) };
}

export function expandEligible(full: string, ents: Ent[]) {
  const ELIGIBLE = new Set<Label | "MEASUREMENT">([
    "ANATOMY","FINDING","DISEASE","PROCEDURE","MEDICATION","SEVERITY","MEASUREMENT"
  ]);
  return ents.map((e) => {
    if (!ELIGIBLE.has(e.label)) return e;
    const exp = expandToWordBoundaries(full, e.start, e.end);
    return { ...e, start: exp.start, end: exp.end, text: exp.text };
  });
}

export function isNegated(full: string, start: number, window = 40) {
  const left = full.slice(Math.max(0, start - window), start).toLowerCase();
  return /\b(no|without|absence of|negative for|denies)\b/.test(left);
}

export function isUncertain(full: string, start: number, end: number, window = 20) {
  const span = full.slice(Math.max(0, start - window), Math.min(full.length, end + window)).toLowerCase();
  return /\b(likely|probable|possibly|may represent|suspicious for|consider)\b/.test(span);
}

export function polish(full: string, ents: Ent[]) {
  const denyAnatomy = new Set(["ao","pati","endobron"]);
  const keepShortWhitelist = new Set(["ct","mr","pet","pet/ct","mm","cm","ml","mg"]);

  return ents
    .map(e => {
      const stripped = e.text.replace(/[.,;:]+$/g, "");
      return { ...e, text: stripped };
    })
    .filter((e) => {
      const t = e.text.trim();
      const tl = t.toLowerCase();

      if (!t) return false;

      if (e.label === "TEST" && /^(images?|exam|contrast|normal|cardiac)$/i.test(t)) return false;
      if (e.label === "MEASUREMENT" && /^(mm|cm)$/i.test(t)) return false;
      if (e.label === "FINDING" && tl.length <= 3) return false;
      if (e.label === "ANATOMY") {
        if (denyAnatomy.has(tl) || tl.length <= 2) return false;
        if (/^(left|right|upper|lower|mid|medial|lateral)$/i.test(t)) return false;
      }
      if (e.label === "TEST" && t === "MR") {
        const around = full.slice(Math.max(0, e.start - 2), Math.min(full.length, e.end + 2)).toUpperCase();
        if (around.includes("MRN")) return false;
      }
      if (e.label === "PROCEDURE" && /^dose$/i.test(t)) return false;

      if (tl.length <= 3 && !keepShortWhitelist.has(tl)) {
        if (/^\d+(\.\d+)?$/.test(t)) return true;
        return false;
      }
      return true;
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// HELPERS – segmentation, sentences, DB
// ──────────────────────────────────────────────────────────────────────────────

export function nextSegment(
  full: string,
  base: number,
  maxChars = CFG.SEGMENT_MAX_CHARS,
  overlap = CFG.SEGMENT_OVERLAP
) {
  const n = full.length;
  if (base >= n) return { text: "", base, nextBase: base };

  const hardEnd = Math.min(n, base + maxChars);
  let end = hardEnd;

  if (end < n) {
    const lastSpace = full.lastIndexOf(" ", end);
    if (lastSpace > base + 200) end = lastSpace;
  } else {
    const slice = full.slice(base, n).trim();
    return { text: slice, base, nextBase: n };
  }

  const rawSlice = full.slice(base, end);
  const slice = rawSlice.trim();

  let nextBaseCandidate = end;
  while (nextBaseCandidate < n && /\s/.test(full[nextBaseCandidate] ?? "")) {
    nextBaseCandidate++;
  }

  let nextBase = Math.max(base + 1, nextBaseCandidate - overlap);

  if (slice.length === 0) {
    nextBase = Math.max(nextBase, end);
  }

  if (nextBase > n) nextBase = n;

  return { text: slice, base, nextBase };
}
