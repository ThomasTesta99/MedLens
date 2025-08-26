'use client'
import React, { FormEvent } from 'react'

const Upload = () => {

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

  }

  return (
    <div className='upload-card mx-auto'>
      <h2 className='upload-title'>Upload A Medical Document</h2>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <div>
          <div className="w-full space-y-3">
            <label htmlFor="title">Document Title</label>
            <input type="text" className="upload-input mt-2"  placeholder='eg. Chest X-ray - Aug 2025'/>
          </div>
          <div>
            <div className="mt-4 mb-2">
              <label htmlFor="file-title">File</label>
            </div>
            <label
              htmlFor="file"
              className='dropzone'
            >
              <div className="dropzone-help">
                <div className="mb-1 text-sm font-medium">Drag & drop your file</div>
                <div className="dropzone-sub">PDF, JPG or PNG</div>
              </div>
              <input
                id="file"
                name="file"
                type="file"
                accept=".pdf,image/*"
                className="sr-only"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Upload
