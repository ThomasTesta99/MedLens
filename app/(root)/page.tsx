
import DocumentTable from '@/components/DocumentTable';
import Topbar from '@/components/Topbar'
import { getUserSession } from '@/lib/user-actions/authActions'
import Image from 'next/image';
import React from 'react'

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
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300">
              Upload your medical documents to receive a clear, plain-English summary with citations.{" "}
              <span className="text-slate-400">
                <strong>Informational only — not medical advice.</strong>
              </span>
            </p>
          </div>
        </div>

        <section className="mx-auto flex flex-col">
          <DocumentTable />
          <button className='btn-primary mt-8 text-2xl mx-auto'>
            Upload New Document
          </button>
        </section>

        <section className="mx-auto max-w-6xl px-4 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur h-full flex flex-col">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Image src="/icons/shield.svg" alt="shield" width={28} height={28} className="invert opacity-50" />
                <h4 className="text-2xl font-semibold text-white">Safety</h4>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-center">
                MedLens is for education only — not medical advice, diagnosis, or treatment.
                Summaries can be incomplete or wrong; always review the original report and talk to your clinician.
                If this is an emergency, call your local emergency number.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur h-full flex flex-col">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Image src="/icons/lock.svg" alt="lock" width={28} height={28} className="invert opacity-50" />
                <h4 className="text-2xl font-semibold text-white">Security</h4>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-center">
                Your files stay private to your account. Data is encrypted in transit and at rest,
                and your reports aren’t used to train models without your consent. You can delete uploads and
                summaries at any time.
              </p>
            </div>
          </div>
        </section>
      </div>

    </main>
  )
}

export default page
