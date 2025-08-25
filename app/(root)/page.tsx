
import Topbar from '@/components/Topbar'
import { getUserSession } from '@/lib/user-actions/authActions'
import React from 'react'

const page = async () => {
  const session = await getUserSession();
  const user = session?.user;


  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white'>
      <Topbar user={user}/>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-5xl font-semibold tracking-light">Your documents</h1>
        </div>
      </div>
    </main>
  )
}

export default page
