import { getAllJobErrors } from '@/lib/job';
import { getUserSession } from '@/lib/user-actions/authActions'
import { Job } from '@/types/types';
import { notFound, redirect } from 'next/navigation';
import React from 'react'
import { formatDate } from '../all-documents/page';
import JobErrorList from '@/components/JobErrorList';

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

        {jobList.length === 0 ? (
            <p>No Failed Jobs</p>
        ): (
            <JobErrorList jobErrorList={jobList}/>
        )}
    </main>
  )
}

export default page
