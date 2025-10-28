import CitationsList from '@/components/CitationsList';
import DocumentHeader from '@/components/DocumentHeader';
import Retry from '@/components/Retry';
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

 type DocSentence = { idx: number; text: string };

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

  const cleanSummary = (summary?.summary ?? "").replace(/\s*\[(\d+(,\s*\d+)*)\]/g, "");
  const summarySentences = splitIntoSentences(cleanSummary);

  const idxToDocText = new Map<number, string>();
  (sentences as DocSentence[]).forEach(s => idxToDocText.set(s.idx, s.text));

  type Citation = { sentenceIdx: number; sourceSentenceIdxes: number[] };

  const oldCitations: Citation[] = (summary?.citations ?? []) as Citation[];

  const citations = oldCitations
    .filter(c => c.sentenceIdx >= 0 && c.sentenceIdx < summarySentences.length)
    .map((c) => ({
      targetIdx: c.sentenceIdx,                                   
      targetText: summarySentences[c.sentenceIdx] ?? "[unavailable]", 
      sources: (c.sourceSentenceIdxes ?? []).map((si) => ({      
        idx: si,
        text: idxToDocText.get(si) ?? "[source sentence unavailable]",
      })),
    }));
  const grouped = entities.reduce((m, e) => {
    const key = e.label ?? "UNKNOWN";
    const arr = m.get(key) ?? [];
    arr.push(e);
    m.set(key, arr);
    return m;
  }, new Map<string, Entity[]>());

  return (
    <div className="px-6 py-8">
      <DocumentHeader documentId={documentId} documentTitle={document.title}/>
      {document.error && (
        <div className="mb-4 items-center flex flex-row gap-6">
          <p className="text-red-400">There was an error processing your document</p>
          <Retry documentId={documentId}/>
        </div>
      )}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="content-box p-6">
            <h2 className="text-xl font-semibold mb-3">Plain-English Summary</h2>
            <p className="text-slate-200 leading-7 whitespace-pre-wrap">
              {summary?.summary ?? "No summary available."}
            </p>
          </div>

          <div className="content-box p-6">
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

          <div className="content-box p-6">
            <h3 className="text-lg font-semibold mb-3">Citations</h3>
            <CitationsList items={citations} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className='content-box p-6'>
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
                              className="entity"
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
