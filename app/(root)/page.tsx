import DocumentTable from '@/components/DocumentTable';
import { getUserSession } from '@/lib/user-actions/authActions';
import { getUserDocuments } from '@/lib/user-actions/documents';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const page = async () => {
  const session = await getUserSession();
  const userId = session?.user.id;

  if(!userId) return null;
  
  const result = await getUserDocuments({userId});
  if(!result.success) return null;

  const documents = result.documents;

  return (
    <main className=''>
      <div className="flex flex-col">

        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="text-center space-y-5">
            <h1 className="text-5xl font-semibold tracking-light">Simplify Your Medical Documents</h1>
            <p className="home-subtitle">
              Upload your medical documents to receive a clear, plain-English summary with citations.{" "}
              <span className="text-slate-400">
                <strong>Informational only — not medical advice.</strong>
              </span>
            </p>
          </div>
        </div>

        <section className="mx-auto flex flex-col">
          <DocumentTable documentList={documents}/>
          <Link href={"/upload"} className='btn-primary mt-8 text-2xl mx-auto' >
            Upload New Document
          </Link>
        </section>

        <section className="mx-auto max-w-6xl px-4 mt-8">
          <div className="disclaimer-grid">
            <div className="content-box p-6 h-full flex flex-col">
              <div className="icon-header">
                <Image src="/icons/shield.svg" alt="shield" width={28} height={28} className="invert opacity-50" />
                <h4 className="text-2xl font-semibold">Safety</h4>
              </div>
              <p className="disclaimer-text">
                MedLens is for education only — not medical advice, diagnosis, or treatment.
                Summaries can be incomplete or wrong; always review the original report and talk to your clinician.
                If this is an emergency, call your local emergency number.
              </p>
            </div>

            <div className="content-box p-6 h-full flex flex-col">
              <div className="icon-header">
                <Image src="/icons/lock.svg" alt="lock" width={28} height={28} className="invert opacity-50" />
                <h4 className="text-2xl font-semibold">Security</h4>
              </div>
              <p className="disclaimer-text">
                Your files stay private to your account. Data is encrypted in transit and at rest,
                and your reports aren’t used to train models without your consent. You can delete uploads and
                summaries at any time.
              </p>
            </div>
          </div>
        </section>
      </div>

    </main>
  )
}

export default page
