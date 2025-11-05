'use client'
import { formatDate } from '@/app/(root)/all-documents/page';
import { Job } from '@/types/types'
import React, { useEffect, useMemo, useState } from 'react'

const JobErrorList = ({jobErrorList} : {jobErrorList : Job[]}) => {
    const [jobList, setJobList] = useState(jobErrorList || []);
    const [deletingJobs, setDeletingJobs] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if(!deletingJobs) setJobList(jobErrorList ?? []);
    }, [jobErrorList, deletingJobs]);

    const allIds = useMemo(() => jobList.map((j) => j.id), [jobList]);
    const allSelected = selected.size > 0 && selected.size === allIds.length;

    const toggleDelete = () => {
        setDeletingJobs((v) => {
            const next = !v;
            if(!next) setSelected(new Set());
            return next;
        });
        setError(null);
    }

    const toggleOne = (id : string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if(next.has(id)){
                next.delete(id);
            }else{
                next.add(id);
            }
            return next;
        })
    };

    const toggleAll = () => {
        setSelected((prev) => {
            if(prev.size === allIds.length) return new Set();
            return new Set(allIds);
        })
    }


    const handleDelete = () => {
        console.log(selected);
    }

    return (
        <div>
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Failed Jobs</h1>
                <div className='flex items-center gap-2'>
                    {deletingJobs && (
                        <div className='space-x-2'>
                            <button className="change-button cursor-pointer" onClick={toggleDelete}>Close</button>
                            <button 
                                className="change-button cursor-pointer"
                                disabled = {jobList.length === 0}
                                onClick={toggleAll}
                            >
                                {allSelected ? "Clear All" : "Select All"}
                            </button>
                            <button className="change-button text-red-400" onClick={handleDelete}>
                                {deleting ? "Deleting..." : `Delete ${selected.size || ""} ${selected.size ? "selected" : ""}`.trim()}
                            </button>
                        </div>

                    )}
                    {!deletingJobs && (
                        <button 
                            className="change-button text-red-400"
                            onClick={() => {setDeletingJobs(true)}}
                        >
                            {deletingJobs ? "Select Jobs to Delete" : "Delete Jobs"}
                        </button>
                    )}
                </div>
            </div>

            {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

            <ul className="space-y-3">
                {jobList.map((j) => {
                    return (
                        <li className="rounded-2xl border p-3 text-sm flex flex-row gap-4 items-start" key={j.id}>
                            {deletingJobs && (
                                <input 
                                    type='checkbox'
                                    className='mt-1'
                                    checked={selected.has(j.id)}
                                    onChange={() => toggleOne(j.id)}
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
