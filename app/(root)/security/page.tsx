import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <header>
        <div className='flex flex-row gap-2'>
            <Image src="/icons/lock.svg" alt = "lock" width={30} height={30} className='invert'/>
            <h1 className="text-3xl font-semibold">Security, Data & Privacy</h1>
        </div>
        <p className="mt-2 text-slate-300">
          How this app treats your account and your uploaded documents—clearly and simply.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="mt-2 text-slate-300 text-sm leading-6">
          This page explains what information the app uses, how it&apos;s handled, and what you can
          expect today. It&apos;s informational only—no medical advice, diagnosis, or treatment.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold">What We Do Today</h2>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>• You upload medical documents and can view summaries with citations.</li>
          <li>• Your documents are tied to your account; other users cannot access them.</li>
          <li>• You can delete your documents and their generated data from your account.</li>
          <li>• We don&apos;t share your uploads for advertising.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold">Your Data & Controls</h2>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>• <strong>Uploads:</strong> Files you add (e.g., PDFs) and basic metadata (title, timestamps).</li>
          <li>• <strong>Derived data:</strong> Sentences, entities, summaries, and citations created from your files.</li>
          <li>• <strong>Controls:</strong> Delete your documents (and derived data) any time from the document page.</li>
          <li>• <strong>Access:</strong> Only you (signed in) can view or delete your uploaded content.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold">Security (At a Glance)</h2>
        <p className="mt-2 text-slate-300 text-sm">
          We aim for sensible defaults and incremental hardening. We won&apos;t list controls here that
          the app doesn&apos;t implement yet.
        </p>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>• Account sign-in is required to view your documents.</li>
          <li>• Admin access is limited to development/maintenance (no routine human review).</li>
          <li>• Features like 2FA, device/session management UIs, and exports may be added over time.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold">What We Don&apos;t Do</h2>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>• We don&apos;t provide medical advice. Always consult a clinician.</li>
          <li>• We don&apos;t claim regulatory compliance (e.g., HIPAA/GDPR) at this time.</li>
          <li>• We don&apos;t sell your uploads to third parties.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold">Roadmap</h2>
        <p className='text-sm text-slate-400'>What&apos;s planned doen the line:</p>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>□ Data export (download my documents and summaries)</li>
          <li>□ Retention settings (auto-delete after N days)</li>
          <li>□ Consent preferences (opt in/out for future model improvements)</li>
          <li>□ Optional 2FA and session/device management UI</li>
        </ul>
      </section>
    </main>
  )
}

export default page
