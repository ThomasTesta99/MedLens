
import { getUserSession } from '@/lib/user-actions/authActions'
import { getUserDocuments } from '@/lib/user-actions/documents';
import Link from 'next/link';
import React from 'react'

type Doc = {
  id: string;
  title: string | null;
  status: string;
  sourceType: string | null;
  pageCount: number | null;
  ingestMethod: string | null;
  createdAt: Date | string | null;
  error: string | null;
  // If you can, have your getUserDocuments include a tiny summary string
  // e.g. latest summary row; otherwise, omit the preview below.
  summary?: string | null;
};

const page = async () => {
    const session = await getUserSession();
    const user = session?.user;


    if(!user) {
        return(
            <div className='p-6 text-slate-300'>
                No User found
            </div>
        )
    }
    const result = await getUserDocuments({ userId: user.id });
    const documents = (result.success ? result.documents : []) as Doc[] | undefined;
    if (!documents || documents.length === 0) {
        return (
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold text-white">Your documents</h1>
                <p className="mt-2 text-slate-300">
                    You haven&apos;t uploaded any documents yet.
                </p>
                <div className="mt-4">
                    <Link
                        href="/upload"
                        className="inline-flex items-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
                    >
                        Upload a document
                    </Link>
                </div>
            </div>
        );
    }

    return (
    <main className="px-6 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">All documents</h1>
        <p className="mt-1 text-sm text-slate-300">
          Browse your uploaded files, see processing status, and jump into details.
        </p>
      </header>

      {/* Grid of cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </section>
    </main>
  );
}

function DocumentCard({ doc }: { doc: Doc }) {
  const created = doc.createdAt ? formatDate(doc.createdAt) : null;
  const title = doc.title?.trim() || "Untitled document";

  return (
    <Link
      href={`/document/${doc.id}`}
      className="group block rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:bg-white/10 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-medium text-white line-clamp-2">
          {title}
        </h2>
        <StatusBadge status={doc.status} />
      </div>

      <div className="mt-3 text-sm text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
        {created && <span>Created {created}</span>}
        {typeof doc.pageCount === "number" && <span>{doc.pageCount} pages</span>}
        {doc.sourceType && <span>Source: {doc.sourceType}</span>}
        {doc.ingestMethod && <span>Ingest: {doc.ingestMethod}</span>}
      </div>

      {/* Summary preview (optional if you have it) */}
      {doc.summary ? (
        <p className="mt-3 text-slate-200 text-sm leading-6 line-clamp-3">
          {doc.summary}
        </p>
      ) : null}

      {/* Error hint */}
      {doc.error ? (
        <p className="mt-3 text-sm text-rose-400 line-clamp-2">
          Error: {doc.error}
        </p>
      ) : null}

      {/* Subtle affordance */}
      <div className="mt-4 flex items-center gap-2 text-indigo-300 text-sm opacity-0 group-hover:opacity-100 transition">
        <span>Open</span>
        <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L12 6.414V16a1 1 0 11-2 0V6.414L6.707 9.707A1 1 0 115.293 8.293l5-5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
    status = status.toUpperCase();
    const styles =
        status === "PROCESSING"
        ? "bg-amber-500/15 text-amber-200 border-amber-500/30"
        : status === "READY"
        ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
        : status === "ERROR"
        ? "bg-red-500/15 text-red-200 border-red-500/30"
        : "bg-white/10 text-slate-200 border-white/15";

    return (
        <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${styles}`}>
        {status}
        </span>
    );
}

function formatDate(d: Date | string) {
    const date = typeof d === "string" ? new Date(d) : d;

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default page
