'use client'
import { documents } from '@/constants'
import { useRouter } from 'next/navigation'
import React from 'react'

const DocumentTable = () => {
    const router = useRouter();
  return (
    <div className="max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur">
            <div className="hidden md:block">
                <table className="min-w-full text-left">
                    <thead className="text-slate-300">
                        <tr className="border-b border-white/10">
                        <th className="px-3 py-2 font-medium">Title</th>
                        <th className="px-3 py-2 font-medium">Uploaded</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((doc) => (
                            <tr 
                                className="border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-colors focus:outline-none focus-visible:bg-white/10" 
                                key={doc.id}
                                onClick={() => {
                                    router.push(`/documents/${doc.id}`)
                                }}
                            >
                                <td className="px-3 py-3">
                                <div className="font-medium text-white">{doc.title}</div>
                                </td>
                                <td className="px-3 py-3 text-slate-300">{doc.uploaded}</td>
                                <td className="px-3 py-3">
                                    <span
                                    className={[
                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ring-1",
                                        doc.status === "READY" && "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
                                        doc.status === "PROCESSING" && "bg-amber-500/15 text-amber-300 ring-amber-400/30",
                                        doc.status === "ERROR" && "bg-rose-500/15 text-rose-300 ring-rose-400/30",
                                        doc.status === "UPLOADED" && "bg-slate-700/60 text-slate-200 ring-white/10",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    >
                                    {doc.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div className="space-y-2 md:hidden">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="block rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 cursor-pointer"
                        onClick={() => {
                            router.push(`/documents/${doc.id}`)
                        }}
                    >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="font-medium text-white">{doc.title}</div>
                            <div className="text-xs text-slate-400">{doc.uploaded}</div>
                        </div>
                        <span
                            className={[
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] ring-1",
                                doc.status === "READY" && "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
                                doc.status === "PROCESSING" && "bg-amber-500/15 text-amber-300 ring-amber-400/30",
                                doc.status === "ERROR" && "bg-rose-500/15 text-rose-300 ring-rose-400/30",
                                doc.status === "UPLOADED" && "bg-slate-700/60 text-slate-200 ring-white/10",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            {doc.status}
                        </span>
                    </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default DocumentTable
