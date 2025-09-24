import CitationsList from '@/components/CitationsList';
import { splitIntoSentences } from '@/lib/sentence';
import { getDocumentAndSummary } from '@/lib/user-actions/documents';
import React from 'react';

type Entity = {
  id: string;
  documentId: string;
  label: string;
  text: string;
  start: number;
  end: number;
  score: string | null;
  createdAt: Date | null; // <-- allow Date here
};

export type Citation = {
  sentenceIdx: number;
  sourceSentenceIdxes: number[];
}

const page = async ({params}: {params : Promise<{id : string}>}) => {
  const parameters = await params;
  const documentId = parameters.id;

  const result = await getDocumentAndSummary({documentId});

  if(!result.success){
    return (
      <div className="p-6 text-red-400">Not Found: {result.message}</div>
    )
  }

  const document = result.document!;
  const summary = result.summary!;
  const entities = result.entities ?? [];
  const sentences = result.sentences ?? [];
  
  let questions: string[] = [];
  if(summary?.questions){
    try {
      const parsed = typeof summary.questions === "string"
        ? JSON.parse(summary.questions)
        : summary.questions;
      if(Array.isArray(parsed)) questions = parsed as string[];

    } catch (error) {
      console.log(error);
    }
  }

  const summarySentences = splitIntoSentences(summary.summary);
  const oldCitations: Citation[] = (summary?.citations ?? []) as Citation[];
  const citations = oldCitations.map((c) => ({
    targetIdx: c.sentenceIdx, 
    targetText: summarySentences[c.sentenceIdx] ?? "[unavailable]", 
    sources: (c.sourceSentenceIdxes ?? []).map((si) => ({
      idx: si, 
      text: sentences[si].text
    }))
  }))
  const grouped = entities.reduce((m, e) => {
    const key = e.label ?? "UNKNOWN";
    const arr = m.get(key) ?? [];
    arr.push(e);
    m.set(key, arr);
    return m;
  }, new Map<string, Entity[]>());

  return (
    <div className="px-6 py-8">
      <header className="mb-8 flex flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-light">
          {document.title ?? "Untitled document"}
        </h1>
        <p className="mt-2 text-sm text-slate-300">Document Id: {document.id}</p>
        </div>
        <div className=''>
          <button className='btn-ghost'>
            Delete Document
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold mb-3">Plain-English Summary</h2>
            <p className="text-slate-200 leading-7 whitespace-pre-wrap">
              {summary?.summary ?? "No summary available."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold mb-3">Common Questions</h3>
            {questions.length ? (
              <ul className="space-y-1">
                {questions.map((item, i) => (
                  <li key={i} className="">
                    <p className="text-slate-200">{i + 1}. {item}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-300">No Questions Generated</p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold mb-3">Citations</h3>
            <CitationsList items={citations} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className='rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur'>
            <h3 className="text-lg font-semibold mb-4">Key Terms & Findings</h3>
              {grouped.size === 0 ? (
                <p className="text-slate-300">No entities detected.</p>
              ) : (
                <div className="space-y-5">
                  {Array.from(grouped.entries()).map(([label, items]) => (
                    <div key={label}>
                      <h4 className="text-xs uppercase tracking-wide text-slate-300 mb-2">
                        {label}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {items
                          .sort((a, b) => Number(b.score ?? 0) - Number(a.score ?? 0))
                          .slice(0, 24)
                          .map((e) => (
                            <span
                              key={e.id}
                              className="text-sm rounded-full border border-white/10 bg-white/10 px-3 py-1 text-slate-200"
                              title={[
                                e.label ? `label: ${e.label}` : null,
                                e.score != null ? `score: ${e.score}` : null,
                                e.start != null && e.end != null ? `span: ${e.start}-${e.end}` : null,
                              ].filter(Boolean).join(" • ")}
                            >
                              {e.text}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

          </div>
        </aside>
      </section>
    </div>
  )
}

export default page
