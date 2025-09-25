import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Help / FAQ</h1>
        <p className="mt-2 text-slate-300">
          Quick answers to common questions about using MedLens.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">What does MedLens do?</h2>
        <p className="mt-2 text-slate-300 text-sm leading-6">
          MedLens helps you understand medical documents by generating a plain-English
          summary and showing citations back to the original sentences.
          It is informational only and <strong>not medical advice</strong>.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">Common Questions</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-medium text-white">Is this medical advice?</h3>
            <p className="mt-1 text-slate-300 text-sm leading-6">
              No. MedLens is for education only and may be incomplete or inaccurate.
              Always consult your clinician for diagnosis or treatment decisions.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-white">Who can see my documents?</h3>
            <p className="mt-1 text-slate-300 text-sm leading-6">
              Documents are private to your signed-in account. You can delete your
              uploads and generated data at any time from the document page.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-white">What kinds of files work best?</h3>
            <p className="mt-1 text-slate-300 text-sm leading-6">
              Digital reports like radiology summaries, imaging reads, discharge notes,
              and lab narratives. Scanned or handwritten documents may require OCR and
              can be less accurate.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-white">How are the summaries created?</h3>
            <p className="mt-1 text-slate-300 text-sm leading-6">
              We analyze the text to find key medical concepts and generate a concise
              explanation. Each summary sentence links to one or more original sentences
              so you can verify the source.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-white">What if the summary looks wrong?</h3>
            <p className="mt-1 text-slate-300 text-sm leading-6">
              Please rely on the original report and your clinician for decisions.
              MedLens is an assistive tool and can make mistakes.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">How do I…</h2>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>
            <span className="text-white font-medium">Upload a document:</span>{" "}
            Go to{" "}
            <Link href="/upload" className="text-indigo-300 hover:text-indigo-200 underline">
              Upload
            </Link>
            , choose your file, and submit.
          </li>
          <li>
            <span className="text-white font-medium">Open a document:</span>{" "}
            Visit{" "}
            <Link href="/all-documents" className="text-indigo-300 hover:text-indigo-200 underline">
              All Documents
            </Link>{" "}
            and click a card.
          </li>
          <li>
            <span className="text-white font-medium">Delete a document:</span>{" "}
            Open the document page and click <span className="text-slate-200">Delete Document</span>.
          </li>
        </ul>
      </section>

      <footer className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">Important Reminder</h2>
        <p className="mt-2 text-slate-300 text-sm">
          MedLens is for education only—never for emergencies, diagnosis, or treatment.
          If you think you may be having a medical emergency, call your local emergency number.
        </p>
      </footer>
    </main>
  )
}

export default page
