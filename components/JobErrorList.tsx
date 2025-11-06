'use client'
import { formatDate } from '@/app/(root)/all-documents/page';
import { deleteJobs } from '@/lib/job';
import { Job } from '@/types/types'
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';

const JobErrorList = ({jobErrorList} : {jobErrorList : Job[]}) => {
    const [jobList, setJobList] = useState(jobErrorList || []);
    const [deletingJobs, setDeletingJobs] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [deleting, setDeleting] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if(!deletingJobs) setJobList(jobErrorList ?? []);
    }, [jobErrorList, deletingJobs]);

    const allIds = useMemo(() => jobList.map((j) => j.id), [jobList]);
    const allSelected = selected.size > 0 && selected.size === allIds.length;

    const router = useRouter();


    const handleCopy = async (id: string) => {
        try {
            await navigator.clipboard.writeText(id);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1500);
        } catch {
            
        }
    }


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


    const handleDelete = async () => {
        if(selected.size === 0) return;
        setDeleting(true);
        setError(null);
        try {
            const ids = Array.from(selected);
            const result = await deleteJobs({jobList : ids});
            if(result.success){
                toast.success(`${selected.size} job(s) deleted successfully.`);
                const deleted = new Set<string>(Array.from(selected));
                setJobList((list) => list.filter((j) => !deleted.has(j.id)));
                setSelected(new Set());
                setDeletingJobs(false);
                router.refresh();
            }else{
                toast.error("There was an error deleting selected jobs.");
                setError(result.error as string);
            }
        } catch (error) {
            setError(error as string);
        }finally{
            setDeleting(false);
        }
    }

    return (
        <div>
            <div className="list-container">
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
                        <li
                            key={j.id}
                            className="list-item"
                        >
                            <div className="flex items-start gap-4">
                                {deletingJobs && (
                                    <input
                                    type="checkbox"
                                    checked={selected.has(j.id)}
                                    onChange={() => toggleOne(j.id)}
                                    className="
                                        list-checkbox"
                                    />
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="font-mono text-xs truncate" title={j.id}>#{j.id}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="list-job-status">
                                                {j.status.toUpperCase()}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(j.id)}
                                                className={`rounded-md border border-white/15 px-2 py-1 text-xs
                                                            ${copiedId === j.id ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                                                disabled={copiedId === j.id}
                                                title={copiedId === j.id ? "Copied!" : "Copy job ID"}
                                            >
                                                {copiedId === j.id ? "Copied!" : "Copy ID"}
                                            </button>
                                            <span className="sr-only" aria-live="polite">
                                                {copiedId === j.id ? "Job ID copied to clipboard" : ""}
                                            </span>
                                        </div>
                                    </div>


                                    <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
                                        <div className="text-xs opacity-70">Type</div>
                                        <div className="font-medium">{j.type}</div>

                                        <div className="text-xs opacity-70">Created</div>
                                        <div>{formatDate(j.createdAt)}</div>

                                        <div className="text-xs opacity-70">Updated</div>
                                        <div>{formatDate(j.updatedAt)}</div>
                                    </div>

                                    <details className="mt-3 group">
                                        <summary className="cursor-pointer list-none text-red-300 hover:text-red-200">
                                            <span className="underline decoration-dotted underline-offset-4">
                                                {j.error ? "Error message" : "No error"}
                                            </span>
                                        </summary>
                                        <div className="list-job-error">
                                            {j.error ?? "—"}
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default JobErrorList
