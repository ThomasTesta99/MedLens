import { getAllJobErrors } from '@/lib/job';
import { getUserSession } from '@/lib/user-actions/authActions'
import { Job } from '@/types/types';
import { notFound, redirect } from 'next/navigation';
import React from 'react'
import { formatDate } from '../all-documents/page';

const page = async () => {
    const session = await getUserSession();
    const user = session?.user;

    if(!user){
        redirect("/sign-in")
    }

    if(user.role !== "admin"){
        notFound();
    }

    const result = await getAllJobErrors();
    const jobList = result.jobList as Job[] || [];


  return (
    <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Failed Jobs</h1>
        {jobList.length === 0 ? (
            <p>No Failed Jobs</p>
        ): (
            <ul className="space-y-3">
                {jobList.map((j) => (
                    <li className="rounded-2xl border p-3 text-sm" key={j.id}>
                        <div className="font-mono">id: {j.id}</div>
                        <div>type: {j.type}</div>
                        <div>status: {j.status}</div>
                        <div className="truncate">error: {j.error ?? "—"}</div>
                        <div className="text-xs opacity-70">
                            created: {formatDate(j.createdAt)} | updated: {formatDate(j.updatedAt)}</div>
                            
                    </li>
                ))}
            </ul>
        )}
    </main>
  )
}

export default page
