const STOP = new Set([
  "the","a","an","and","or","but","if","to","of","in","on","for","with","by","as","is","are","was","were","be","been","it","that","this","these","those","at","from","into","over","about","no","not"
]);

function tokenize(s: string) : string[]{
    return s
        .toLowerCase()
        .replace(/[^a-z0-9\s.-]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOP.has(w));
}

function scoreOverlap(a: Set<string>, b: Set<string>) : number {
    let score = 0;
    for(const w of a) if(b.has(w)) score += 1;
    return score;
}

type SentenceType = { 
    sentenceIdx: number; 
    sourceSentenceIdxes: number[]
}

export function buildSentenceCitations(
    sumamryMd: string, 
    sourceSentences: string[], 
    topK = 2,
): Array<SentenceType>{
    const sumSentences = sumamryMd
        .replace(/\s+/g, " ")
        .split(/(?<=[.!?])\s+(?=[A-Z(])/)
        .map(s => s.trim())
        .filter(s => s.length > 0)

    const sourceTokens : Array<Set<string>> = sourceSentences.map(s => new Set(tokenize(s)));
    const result : Array<SentenceType> = [];

    sumSentences.forEach((sent, i) => {
        const t = new Set(tokenize(sent));
        const scored = sourceTokens.map((src, idx) => ({idx, score: scoreOverlap(t, src)}));
        scored.sort((x,y) => y.score - x.score);
        const picks = scored.slice(0, topK).filter(s=> s.score > 0).map(s => s.idx);
        result.push({sentenceIdx: i, sourceSentenceIdxes: picks})
    })

    return result;
}