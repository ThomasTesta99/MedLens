
import Topbar from '@/components/Topbar';
import { getUserSession } from '@/lib/user-actions/authActions'
import React, { ReactNode } from 'react'

const layout = async ({children}: {children: ReactNode}) => {
  const session = await getUserSession();
  const user = session?.user;
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="">
        <Topbar user={user} />
      </div>
      <div className="">
        {children}
      </div>
    </main>
  )
}

export default layout
