'use client'
import { deleteDocumentData } from '@/lib/user-actions/documents';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const DocumentHeader = ({documentId, documentTitle}: {documentId: string, documentTitle: string | null}) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsLoading(true);

        try {
            if(!confirm("Are you sure you want to delete this document?")) return;
            const result = await deleteDocumentData({documentId});
            
            if(!result.success){
                console.log(result.message);
            }else{
                router.push("/");
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }
    
    return (
        <header className="mb-8 flex flex-row justify-between items-center">
            <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-light">
                    {documentTitle ?? "Untitled document"}
                </h1>
                    <p className="mt-2 text-sm text-slate-300">Document Id: {documentId}</p>
                </div>
            <div className='flex flex row items-center'>
                <button className='btn-ghost' onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? "Deleting Document..." : "Delete Document"}
                </button>
            </div>
        </header>
    )
}

export default DocumentHeader
