'use client'
import { documents, TABLE_LENGTH } from '@/constants'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function DocumentTable() {
  const router = useRouter()
  const documentList = documents.slice(0, TABLE_LENGTH)

  if (!documentList.length) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
          <h2 className="text-xl font-semibold tracking-tight text-white">No recent documents</h2>
          <p className="mt-1 text-medium text-slate-300">
            Upload your first report to see it here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Your recent documents</h2>
        <Link href="/documents" className="text-sm text-indigo-300 hover:text-indigo-200">
          View all
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur">
        <div className="hidden md:block">
          <table className="min-w-full text-left text-medium">
            <thead className="text-slate-300">
              <tr className="border-b border-white/10">
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Uploaded</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {documentList.map((doc) => {
                return (
                  <tr
                    key={doc.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open ${doc.title}`}
                    className="border-b border-white/5 last:border-0 cursor-pointer transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:bg-white/10"
                    onClick={() => router.push(`/document/${doc.id}`)}
                  >
                    <td className="px-3 py-3">
                      <div className="font-medium text-white">{doc.title}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-300">{doc.uploaded}</td>
                    <td className="px-3 py-3">
                      <span 
                        className={[ "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] ring-1", 
                            doc.status === "READY" && "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30", 
                            doc.status === "PROCESSING" && "bg-amber-500/15 text-amber-300 ring-amber-400/30", 
                            doc.status === "ERROR" && "bg-rose-500/15 text-rose-300 ring-rose-400/30", 
                            doc.status === "UPLOADED" && "bg-slate-700/60 text-slate-200 ring-white/10", 
                            ] .filter(Boolean) .join(" ")} 
                        > 
                            {doc.status} 
                        </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 md:hidden">
          {documentList.map((doc) => {
            return (
              <Link
                key={doc.id}
                href={`/document/${doc.id}`}
                aria-label={`Open ${doc.title}`}
                className="block rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{doc.title}</div>
                    <div className="text-xs text-slate-400">{doc.uploaded}</div>
                  </div>
                  <span 
                    className={[ "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] ring-1", 
                        doc.status === "READY" && "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30", 
                        doc.status === "PROCESSING" && "bg-amber-500/15 text-amber-300 ring-amber-400/30", 
                        doc.status === "ERROR" && "bg-rose-500/15 text-rose-300 ring-rose-400/30", 
                        doc.status === "UPLOADED" && "bg-slate-700/60 text-slate-200 ring-white/10", 
                        ] .filter(Boolean) .join(" ")} 
                    > 
                        {doc.status} 
                    </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
