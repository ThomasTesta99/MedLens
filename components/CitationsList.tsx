import React from 'react'

type CitationProps = {
  targetIdx: number;
  targetText: string;
  sources: Array<{ idx: number; text: string }>;
};

const CitationsList = ({ items }: { items: CitationProps[] }) => {
  if (!items?.length) {
    return <p className="text-slate-300">No citations available.</p>;
  }

  return (
    <details className="group citation-container">
      <summary className="citation-summary">
        <div className="flex flex-col gap-1.5 group-open:hidden">
          <p className="citation-summary-text">
            Citations show which original report sentences support each summary sentence.
          </p>
          <p className="text-sm text-gray-400">Please note that text extracted from PDFs or images may sometimes appear distorted or missing spaces due to how the original file was formatted.</p>
        </div>
        <span className="citation-summary-count">
          <span className="text-sm">({items.length})</span>
          <svg
            className="citation-summary-icon"
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
        </span>
      </summary>

      <ul className="citations-list group-open:block">
        {items.map((c, i) => (
          <li key={i} className="citation-item">
            <div className="flex items-start gap-3">
              <span className="citation-badge">
                {c.targetIdx}
              </span>
              <p className="text-slate-200 leading-6">{c.targetText}</p>
            </div>

            <details className="mt-3 group">
              <summary className="sources-summary">
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="sources-summary-icon group-open:rotate-180"
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
                    <div key={s.idx} className="source-item">
                      <div className="flex items-start gap-2">
                        <span className="source-badge">
                          Sentence {s.idx}
                        </span>
                        <p className="text-sm text-slate-200 leading-6 break-all">{s.text}</p>
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
    </details>
  );
}

export default CitationsList
