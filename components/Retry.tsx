'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { runAllJobs } from './Upload';
import { LABELS } from '@/constants';
import { ClipLoader } from 'react-spinners';

const Retry = ({documentId}: {documentId: string}) => {
    const [retrying, setRetrying] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const onRetry = async () => {
        try {
            setRetrying(true);
            setMessage("Retrying document upload...");

            const result = await fetch(`/api/documents/${documentId}/retry`,{ method: "POST"});
            if(!result.ok){
                const json = await result.json().catch(() => ({}));
                setMessage(json.error || "Retry failed");
            }

            setMessage("Processing");
            await runAllJobs({
                maxRuns: 50,
                onTick: (jobType) => {
                    if(!jobType){
                    return;
                    }
                    const message = LABELS[jobType];
                    setMessage(message);
                }
            });

            setMessage("Done.");
            router.refresh();
            setMessage("")
        } catch (error) {
            setMessage(error as string);
        }finally{
            setRetrying(false);
        }
    }

    return (
        <div className=''>
            <div className="flex flex-row gap-2">
                <button className="btn-ghost" onClick={onRetry} disabled={retrying}>
                    {retrying ? "Retrying..." : "Retry Uploading"}
                </button>
                {retrying ? (<ClipLoader color='white'/> ) : <></>}
            </div>
            {message && <p className='mt-2 text-sm text-slate-300'>{message}</p>}
        </div>
    )
}

export default Retry
