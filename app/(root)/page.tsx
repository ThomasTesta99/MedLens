
import Topbar from '@/components/Topbar'
import { getUserSession } from '@/lib/user-actions/authActions'
import React from 'react'

const page = async () => {
  const session = await getUserSession();
  const user = session?.user;


  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white'>
      <div className="flex flex-col">
        <Topbar user={user}/>


        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-8 text-center space-y-5">
            <h1 className="text-5xl font-semibold tracking-light">Simplify Your Medical Documents</h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
              Upload your medical documents to receive a clear, plain-English summary with citations.{" "}
              <span className="text-slate-400">
                Informational only — not medical advice.
              </span>
            </p>
          </div>
        </div>
      </div>


    </main>
  )
}

export default page
