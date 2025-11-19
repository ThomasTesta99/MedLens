'use client'

import { LABELS } from '@/constants';
import { Job, JobType } from '@/lib/entityUtils';
import { convertPdfToImage } from '@/lib/pdf2image';
import { useRouter } from 'next/navigation';
import React, { type FormEvent, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ClipLoader } from 'react-spinners';

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function runAllJobs(
  opts: { maxRuns?: number; onTick?: (jobtype?: JobType) => void } = {},
): Promise<void> {
  const maxRuns = opts.maxRuns ?? 8;
  for (let i = 0; i < maxRuns; i++) {
    const res = await fetch('/api/jobs/run', { method: 'POST' });
    if (!res.ok) {
      throw new Error('Error running job');
    }
    const data = (await res.json()) as Job;

    if (opts.onTick) opts.onTick(data.nextJobType);
    if (!data.processed) break;
  }
}

async function ocrImageFile(file: File): Promise<string> {
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng');
  const { data } = await worker.recognize(file);
  await worker.terminate();
  return (data?.text ?? '').trim();
}

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maxFileSize = 20 * 1024 * 1024;
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const handleFileSelect = (file: File | null) => {
      setFile(file);
      setError(null);
    };
    const f = acceptedFiles[0] || null;
    handleFileSelect(f);
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

    try {
      const formData = new FormData(e.currentTarget);
      const title = (formData.get('title') as string | null) ?? '';

      if (file == null) {
        setError('Please select a file.');
        setIsLoading(false);
        return;
      }

      if (file.type.startsWith('image/')) {
        setStatus('File Uploaded. Reading document...');

        const text = await ocrImageFile(file);
        if (!text) {
          setError('Could not extract text from the file.');
          setStatus(null);
          setIsLoading(false);
          return;
        }

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            text,
            sourceType: 'image',
            ingestMethod: 'ocr',
            pageCount: 1,
          }),
        });

        if (!res.ok) {
          const resJson = await res.json().catch(() => ({}));
          setError(resJson.error || 'Upload failed.');
          setStatus(null);
          setIsLoading(false);
          return;
        }

        setStatus('File Uploaded. Reading document...');
        const json = await res.json();
        const id = json.id;

        await fetch(`/api/documents/${id}/process`, { method: 'POST' });

        await runAllJobs({
          maxRuns: 50,
          onTick: (jobType) => {
            if (!jobType) return;
            const message = LABELS[jobType];
            setStatus(message);
          },
        });

        setStatus('Done');
        router.push(`/document/${id}`);
        return;
      }

      const uploadForm = new FormData();
      uploadForm.append('title', title);
      uploadForm.append('file', file);

      setStatus('Uploading file...');

      let res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });

      if (!res.ok && file.type === 'application/pdf') {
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) {
          setError('Error: Failed to convert PDF to image');
          console.log(imageFile?.error);
          setIsLoading(false);
          setStatus(null);
          return;
        }

        setStatus('Reading text from converted PDF image...');

        const text = await ocrImageFile(imageFile.file);
        if (!text) {
          setError('Could not extract text from the converted PDF image.');
          setStatus(null);
          setIsLoading(false);
          return;
        }


        res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            text,
            sourceType: 'image',
            ingestMethod: 'ocr',
            pageCount: 1,
          }),
        });
      }

      if (!res.ok) {
        const resJson = await res.json().catch(() => ({}));
        setError(resJson.error || 'Upload failed.');
        setStatus(null);
        setIsLoading(false);
        return;
      }

      setStatus('File Uploaded. Reading document...');

      const json = await res.json();
      const id = json.id;

      await fetch(`/api/documents/${id}/process`, { method: 'POST' });

      await runAllJobs({
        maxRuns: 50,
        onTick: (jobType) => {
          if (!jobType) {
            return;
          }
          const message = LABELS[jobType];
          setStatus(message);
        },
      });

      setStatus('Done');
      router.push(`/document/${id}`);
    } catch (err) {
      console.error(err);
      setError('Unexpected error occurred: ' + (err as Error).message);
      setStatus(null);
    } finally {
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
          <p className="text-sm text-slate-200">This could take a few minutes.</p>
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
