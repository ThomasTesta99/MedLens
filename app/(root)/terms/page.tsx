import React from 'react'

const page = () => {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Terms & Disclaimers</h1>
        <p className="mt-2 text-slate-300">
          Please read these terms before using MedLens.
        </p>
      </header>

      <section className="content-box p-6">
        <h2 className="info-title">1. Introduction</h2>
        <p className="terms-text">
          MedLens provides plain-English summaries and citations for uploaded medical
          documents. By using this app, you agree to these terms.
        </p>
      </section>

      <section className="content-box p-6">
        <h2 className="info-title">2. No Medical Advice</h2>
        <p className="terms-text">
          MedLens is for educational purposes only and does not provide medical advice,
          diagnosis, or treatment. Always consult a licensed healthcare professional
          for questions about your health.
        </p>
      </section>

      <section className="content-box p-6">
        <h2 className="info-title">3. User Responsibilities</h2>
        <ul className="terms-text">
          <li>• Do not rely solely on summaries for health decisions.</li>
          <li>• Review the original report and consult a clinician.</li>
          <li>• Ensure you have the right to upload the documents you submit.</li>
        </ul>
      </section>

      <section className="content-box p-6">
        <h2 className="info-title">4. Privacy & Data</h2>
        <p className="terms-text">
          Your uploads are private to your account. You can delete your documents and
          generated data at any time. We do not share your uploads with third parties
          for advertising. We do not make regulatory compliance claims at this time.
        </p>
      </section>

      <section className="content-box p-6">
        <h2 className="info-title">5. Service Availability</h2>
        <p className="mt-2 text-slate-300 text-sm leading-6">
          MedLens is provided “as is” and “as available.” We may modify or discontinue
          features at any time without notice.
        </p>
      </section>

      <section className="content-box p-6">
        <h2 className="info-title">6. Accuracy & Liability</h2>
        <p className="terms-text">
          Summaries and citations may be incomplete or inaccurate. To the fullest extent
          permitted by law, we are not liable for any losses arising from the use of the
          app or reliance on its outputs.
        </p>
      </section>

      <section className="content-box p-6">
        <h2 className="info-title">7. Changes to These Terms</h2>
        <p className="terms-text">
          We may update these terms from time to time. Your continued use of the app
          after changes are posted constitutes acceptance of the updated terms.
        </p>
      </section>

      <footer className="rcontent-box p-6">
        <h2 className="text-xl font-semibold">Questions</h2>
        <p className="terms-text">
          If you have questions about these terms, please check the Help / FAQ page for more
          information.
        </p>
      </footer>
    </main>
  )
}

export default page
