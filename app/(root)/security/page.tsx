import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <header>
        <div className='flex flex-row gap-2'>
            <Image src="/icons/lock.svg" alt = "lock" width={30} height={30} className='invert'/>
            <h1 className="text-3xl font-semibold text-white">Security, Data & Privacy</h1>
        </div>
        <p className="mt-2 text-slate-300">
          How this app treats your account and your uploaded documents—clearly and simply.
        </p>
      </header>

      {/* Overview */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">Overview</h2>
        <p className="mt-2 text-slate-300 text-sm leading-6">
          This page explains what information the app uses, how it’s handled, and what you can
          expect today. It’s informational only—no medical advice, diagnosis, or treatment.
        </p>
      </section>

      {/* What we do today */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">What We Do Today</h2>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>• You upload medical documents and can view summaries with citations.</li>
          <li>• Your documents are tied to your account; other users cannot access them.</li>
          <li>• You can delete your documents and their generated data from your account.</li>
          <li>• We don’t share your uploads for advertising.</li>
        </ul>
      </section>

      {/* Your data & controls */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">Your Data & Controls</h2>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>• <strong>Uploads:</strong> Files you add (e.g., PDFs) and basic metadata (title, timestamps).</li>
          <li>• <strong>Derived data:</strong> Sentences, entities, summaries, and citations created from your files.</li>
          <li>• <strong>Controls:</strong> Delete your documents (and derived data) any time from the document page.</li>
          <li>• <strong>Access:</strong> Only you (signed in) can view or delete your uploaded content.</li>
        </ul>
      </section>

      {/* Security (plain, truthful) */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">Security (At a Glance)</h2>
        <p className="mt-2 text-slate-300 text-sm">
          We aim for sensible defaults and incremental hardening. We won’t list controls here that
          the app doesn’t implement yet.
        </p>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>• Account sign-in is required to view your documents.</li>
          <li>• Admin access is limited to development/maintenance (no routine human review).</li>
          <li>• Features like 2FA, device/session management UIs, and exports may be added over time.</li>
        </ul>
      </section>

      {/* What we don't do / disclaimers */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">What We Don’t Do</h2>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>• We don’t provide medical advice. Always consult a clinician.</li>
          <li>• We don’t claim regulatory compliance (e.g., HIPAA/GDPR) at this time.</li>
          <li>• We don’t sell your uploads to third parties.</li>
        </ul>
      </section>

      {/* Roadmap */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">Roadmap</h2>
        <ul className="mt-3 space-y-2 text-slate-300 text-sm">
          <li>□ Data export (download my documents and summaries)</li>
          <li>□ Retention settings (auto-delete after N days)</li>
          <li>□ Consent preferences (opt in/out for future model improvements)</li>
          <li>□ Optional 2FA and session/device management UI</li>
        </ul>
      </section>

      {/* Help / contact */}
      <footer className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-xl font-semibold text-white">Questions?</h2>
        <p className="mt-2 text-slate-300 text-sm">
          If you have questions or want a feature prioritized, visit{" "}
          <Link href="/help" className="text-indigo-300 hover:text-indigo-200 underline">
            Help / Support
          </Link>.
        </p>
      </footer>
    </main>
  )
}

export default page
