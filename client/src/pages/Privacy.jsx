import { useNavigate } from 'react-router-dom'

export function Privacy() {
  const navigate = useNavigate()
  return (
    <div className="min-h-dvh bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <img src="/logo.png" alt="BoostIntake" className="w-7 h-7 object-contain" />
            <span className="font-bold text-gray-900">BoostIntake</span>
          </button>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800">← Back</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: May 26, 2025</p>

        <div className="prose prose-gray max-w-none flex flex-col gap-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Overview</h2>
            <p>BoostIntake ("we," "us," or "our") is a digital patient intake platform for medical clinics. This Privacy Policy explains how we collect, use, and protect information when you use our service at boostintake.com.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Information We Collect</h2>
            <p className="mb-2"><strong>Clinic accounts:</strong> When a clinic registers, we collect the clinic name, email address, and password (encrypted). We also store clinic settings such as address, phone number, and financial policy values.</p>
            <p className="mb-2"><strong>Patient intake links:</strong> When a clinic sends an intake link, we temporarily store the patient's first name, last name, date of birth, and phone number to verify identity before granting access to the intake forms.</p>
            <p><strong>Form submissions:</strong> Patient health information entered into intake forms is used solely to generate a PDF, which is immediately emailed to the clinic. We do not retain any patient health information (PHI) on our servers after the PDF is delivered.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. How We Use Information</h2>
            <ul className="list-disc list-inside flex flex-col gap-1">
              <li>To provide and operate the BoostIntake service</li>
              <li>To generate and deliver intake form PDFs to clinics</li>
              <li>To send SMS messages containing intake form links to patients</li>
              <li>To process subscription payments via Stripe</li>
              <li>To display anonymized usage statistics to clinic staff</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Data Retention & Deletion</h2>
            <p className="mb-2">Patient health information (PHI) submitted through intake forms is <strong>deleted from our servers immediately after the PDF is generated and emailed</strong> to the clinic.</p>
            <p>Intake tokens (used to verify patient identity) expire after 24 hours and are automatically purged. Clinic account data is retained for the duration of the subscription and deleted upon account closure upon request.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. HIPAA</h2>
            <p>BoostIntake is designed with HIPAA principles in mind. Patient health data is transmitted securely (HTTPS/TLS), not stored beyond the point of delivery, and access is restricted to authorized clinic accounts. Clinics are responsible for their own HIPAA compliance obligations regarding the patient data they receive.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Third-Party Services</h2>
            <p>We use the following third-party services to operate BoostIntake:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 mt-2">
              <li><strong>Supabase</strong> — database and authentication</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Twilio</strong> — SMS delivery</li>
              <li><strong>Amazon SES</strong> — email delivery</li>
            </ul>
            <p className="mt-2">Each provider maintains their own privacy and security standards.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Cookies</h2>
            <p>We use only essential cookies and browser local storage to maintain your login session. We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Contact</h2>
            <p>For privacy-related questions or data deletion requests, contact us at: <a href="mailto:hello@boostintake.com" className="text-blue-600 hover:underline">hello@boostintake.com</a></p>
          </section>

        </div>
      </div>
    </div>
  )
}
