'use client'
import { extractPdfText, ocrImageExtract } from '@/lib/extract';
import { getUserSession } from '@/lib/user-actions/authActions';
import { uploadDocument, uploadDocumentTexts } from '@/lib/user-actions/documents';
import { User } from '@/types/types';
import { useRouter } from 'next/navigation';
import React, { type FormEvent, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ClipLoader } from 'react-spinners';

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const Upload = ({user}: {user: User}) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maxFileSize = 20 * 1024 * 1024;
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const handleFileSelect = (file : File | null) => { 
      setFile(file); 
      setError(null);
    } 
    const file = acceptedFiles[0] || null; 
    handleFileSelect(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'application/pdf': ['.pdf'], 'image/*': [] },
    maxSize: maxFileSize,
  });


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    if(!file) return;
    formData.append("file", file);

    try {
      setStatus("Uploading file...");
      
      const res = await fetch("/api/upload", { method: "POST", body: formData });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Upload failed.");
        setStatus(null);
        return;
      }

      setStatus("Processing complete");
      
      const json = await res.json();
      router.push(`/document/${json.id}`);
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
      setStatus(null);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className='upload-card mx-auto'>
        <h2 className='upload-title'>Upload A Medical Document</h2>

        <form onSubmit={handleSubmit} className='flex flex-col'>
          <div className="w-full space-y-3">
            <label htmlFor="title">Document Title</label>
            <input id="title" name="title" type="text" className="upload-input mt-2" placeholder='eg. Chest X-ray - Aug 2025'/>
          </div>

          <div className="mt-4 mb-2">
            <span className="block">File</span>
          </div>

          <div className='dropzone' {...getRootProps()}>
            <input {...getInputProps()} className="sr-only" />

            {file ? (
              <div className='text-center'>
                <p className="text-lg font-medium truncate">{file.name}</p>
                <p className="text-sm">{formatSize(file.size)}</p>
                <button className="btn-ghost mt-3 cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}>
                  Clear
                </button>
              </div>
            ) : (
              <div className="dropzone-help">
                <div className="mb-1 text-sm font-medium">
                  {isDragActive ? 'Drop the file here…' : 'Drag & drop your file'}
                </div>
                <div className="dropzone-sub">PDF, JPG or PNG</div>
              </div>
            )}
          </div>
          <button className='btn-primary mx-auto mt-5' type='submit'>
            Upload
          </button>
        </form>
      </div>
      {isLoading && (
        <div className='flex flex-col w-full items-center gap-3 p-5'>
          <h2 className='text-2xl text-slate-300 font-semibold'>{status}</h2>
          <ClipLoader color='white'/>
        </div>
      )}
      {error && !isLoading && (
        <div className='mx-auto mt-4 max-w-xl w-full rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 text-center'>
          <h2>{error}</h2>
        </div>
      )}
    </div>
  );
};

export default Upload;
