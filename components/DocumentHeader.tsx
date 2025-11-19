'use client'
import { deleteDocumentData } from '@/lib/user-actions/documents';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const DocumentHeader = ({documentId, documentTitle}: {documentId: string, documentTitle: string | null}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if(!confirm("Are you sure you want to delete this document?")) return;
            const result = await deleteDocumentData({documentId});
            
            if(!result.success){
                toast.error("There was an error deleting the document.");
            }else{
                toast.success("Document deleted.");
                router.push("/");
            }
        } catch (error) {
            setError(error as string);
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
                <button className="flex flex-row gap-2 btn-ghost mt-2" onClick={() => {router.push("/")}}>
                    <Image className="invert"src="/icons/back-arrow.svg" alt="back" width={16} height={16}/>
                    <p>Homepage</p>
                </button>
            </div>
            <div className='flex flex-col items-center space-y-4'>
                <button className='btn-ghost text-red-400' onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? "Deleting Document..." : "Delete Document"}
                </button>
                {error && (
                    <p className="text-red-700">{error}</p>
                )}
            </div>
        </header>
    )
}

export default DocumentHeader
