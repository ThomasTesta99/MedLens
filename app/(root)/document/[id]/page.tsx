import { getDocumentAndSummary } from '@/lib/user-actions/documents';
import React from 'react'

const page = async ({params}: {params : Promise<{id : string}>}) => {
    const parametes = await params;
    const documentId = parametes.id;

    const result = await getDocumentAndSummary({documentId});
    if(!result.success){
      return (
        <div>
          Not found {result.message}
        </div>
      )
    }

    const doc = result.document
    const summary = result.summary;
    
    if(!doc || !summary){
      return (
        <div>
          Something wrong with doc or summary
        </div>
      )
    }

    console.log(summary.citations);
  return (
    <div className=''>
      <p>{doc.id}</p>
      <p>{doc.title}</p>
      <p>{summary.id}</p>
      <p>{summary.documentId}</p>
      <p>{summary.summary}</p>
      <p>{summary.questions}</p>
    </div>
  )
}

export default page
