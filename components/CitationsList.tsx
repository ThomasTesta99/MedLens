
import React from 'react'

type CitationProps = {
  targetIdx: number;
  targetText: string;
  sources: Array<{ idx: number; text: string }>;
};

const CitationsList = ({items} : {items : CitationProps[]}) => {
  return (
    <ul className="space-y-4">
      {items.map((c, i) => (
        <li key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/10 text-slate-200 border border-white/15">
               Sentence {c.targetIdx}
            </span>
            <p className="text-slate-200 leading-6">{c.targetText}</p>
          </div>

          <details className="mt-3 group">
            <summary className="list-none cursor-pointer select-none text-sm text-indigo-300 hover:text-indigo-200">
              <span className="inline-flex items-center gap-2">
                <svg
                  className="size-4 transition-transform duration-200 group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
                Show sources ({c.sources.length})
              </span>
            </summary>

            <div className="mt-3 space-y-2">
              {c.sources.length ? (
                c.sources.map((s) => (
                  <div key={s.idx} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-transparent text-slate-300 border border-white/15">
                        Sentence {s.idx}
                      </span>
                      <p className="text-sm text-slate-200 leading-6">{s.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">No source sentences recorded.</p>
              )}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}

export default CitationsList
