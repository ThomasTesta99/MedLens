export function splitIntoSentences(text: string): string[] {
    const raw = text.replace(/\+/g, " ").trim().split(/(?<=[.!?])\s+(?=[A-Z(])/)
    return raw.map(s => s.trim()).filter(s => s.length > 0);
}