'use client'
import { formatDate } from '@/app/(root)/all-documents/page'
import {TABLE_LENGTH } from '@/constants'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

type DocumentProps = {
    id: string;
    ownerId: string;
    title: string | null;
    sourceType: string | null;
    ingestMethod: string | null;
    pageCount: number | null;
    status: string;
    error: string | null;
    createdAt: Date | string;
    updatedAt?: Date | string | null;
}

export default function DocumentTable({documentList} :  {documentList? : DocumentProps[]}) {
  const router = useRouter()
  documentList = (documentList ?? []).slice(0, TABLE_LENGTH)

  if (!documentList.length) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="content-box p-6 text-center">
          <h2 className="text-xl font-semibold tracking-tight">No recent documents</h2>
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
        <Link href="/all-documents" className="all-docs-link">
          View all
        </Link>
      </div>

      <div className="max-w-2xl p-3 sm:p-4 content-box">
        <div className="hidden md:block">
          <table className="w-full table-fixed text-left text-medium">
            <thead className="text-slate-300">
              <tr className="border-b border-white/10">
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Uploaded</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {documentList.map((doc) => {
                doc.status = doc.status.toUpperCase()
                return (
                  <tr
                    key={doc.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open ${doc.title}`}
                    className="table-row"
                    onClick={() => router.push(`/document/${doc.id}`)}
                  >
                    <td className="px-3 py-3">
                      <div className="font-medium">{doc.title}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-300">{formatDate(doc.createdAt)}</td>
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
                className="small-document-item"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{doc.title}</div>
                    <div className="text-xs text-slate-400">{formatDate(doc.createdAt)}</div>
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
