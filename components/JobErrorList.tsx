'use client'
import { formatDate } from '@/app/(root)/all-documents/page';
import { Job } from '@/types/types'
import React, { useEffect, useState } from 'react'

const JobErrorList = ({jobErrorList} : {jobErrorList : Job[]}) => {
    const [jobList, setJobList] = useState(jobErrorList || []);
    const [deletingJobs, setDeletingJobs] = useState(false);

    useEffect(() => {
        const newJobList = jobErrorList ?? [];
        setJobList(newJobList);
    }, [jobErrorList])
    return (
        <div>
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Failed Jobs</h1>
                <div className='flex items-center gap-2'>
                    {deletingJobs && (
                        <div className='space-x-2'>
                            <button className="change-button cursor-pointer" onClick={() => setDeletingJobs(false)}>Close</button>
                            <button className="change-button cursor-pointer">Select All</button>
                        </div>

                    )}
                    <button 
                        className="change-button text-red-400"
                        onClick={() => {setDeletingJobs(true)}}
                    >
                        {deletingJobs ? "Select Jobs to Delete" : "Delete Jobs"}
                    </button>
                </div>
            </div>
            <ul className="space-y-3">
                {jobList.map((j) => {
                    return (
                        <li className="rounded-2xl border p-3 text-sm flex flex-row gap-4" key={j.id}>
                            {deletingJobs && (
                                <input 
                                    type='checkbox'
                                    className='mt-1'
                                />
                            )}
                            <div className="flex flex-col">
                                <div className="font-mono">id: {j.id}</div>
                                <div>type: {j.type}</div>
                                <div>status: {j.status}</div>
                                <div className="truncate">error: {j.error ?? "—"}</div>
                                <div className="text-xs opacity-70">
                                    created: {formatDate(j.createdAt)} | updated: {formatDate(j.updatedAt)}
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default JobErrorList
