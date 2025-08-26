
import DocumentTable from '@/components/DocumentTable';
import Topbar from '@/components/Topbar'
import { getUserSession } from '@/lib/user-actions/authActions'
import React from 'react'

const statusClass = (status: string) : string => {
  switch(status){
    case "ready":
      return "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30";
    case "processing":
      return "bg-amber-500/15 text-amber-300 ring-amber-400/30";
    case "error":
      return "bg-rose-500/15 text-rose-300 ring-rose-400/30";
    case "uploaded":
      return "bg-slate-700/60 text-slate-200 ring-white/10";
    default:
      return "";
  }
}

const page = async () => {
  const session = await getUserSession();
  const user = session?.user;


  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white'>
      <div className="flex flex-col">
        <Topbar user={user}/>


        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="text-center space-y-5">
            <h1 className="text-5xl font-semibold tracking-light">Simplify Your Medical Documents</h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
              Upload your medical documents to receive a clear, plain-English summary with citations.{" "}
              <span className="text-slate-400">
                <strong>Informational only — not medical advice.</strong>
              </span>
            </p>
          </div>
        </div>

        <section className="mx-auto max-w-6xl px-4">
          <DocumentTable />
        </section>


      </div>

    </main>
  )
}

export default page
