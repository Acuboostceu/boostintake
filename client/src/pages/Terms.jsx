import { useNavigate } from 'react-router-dom'

export function Terms() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: May 26, 2025</p>

        <div className="prose prose-gray max-w-none flex flex-col gap-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>By creating an account or using BoostIntake ("Service"), you agree to these Terms of Service. If you do not agree, do not use the Service. These terms apply to all clinic accounts and their staff.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Description of Service</h2>
            <p>BoostIntake provides digital patient intake form software for medical clinics. The Service allows clinics to send intake forms to patients via SMS, collect completed forms with digital signatures, and receive a PDF summary by email.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Free Trial & Subscription</h2>
            <p className="mb-2">New accounts receive a <strong>14-day free trial</strong> with full access to all features. No credit card is required to start a trial.</p>
            <p className="mb-2">After the trial period, continued use requires a paid subscription at the rates listed on our pricing page. Subscriptions are billed monthly or annually depending on the plan selected.</p>
            <p>You may cancel your subscription at any time through the Billing section of your dashboard. Cancellation takes effect at the end of the current billing period.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Acceptable Use</h2>
            <p className="mb-2">You agree to use BoostIntake only for lawful purposes. You may not:</p>
            <ul className="list-disc list-inside flex flex-col gap-1">
              <li>Use the Service for any purpose other than patient intake for your clinic</li>
              <li>Share your account credentials with unauthorized parties</li>
              <li>Attempt to access other clinics' data</li>
              <li>Send unsolicited SMS messages to individuals who are not your patients</li>
              <li>Misrepresent your identity or clinic information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Your Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You are also responsible for your own compliance with applicable laws, including HIPAA and any state privacy regulations governing your clinic.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Data & Privacy</h2>
            <p>Patient health information submitted through intake forms is used solely to generate the PDF and is deleted from our servers immediately after delivery. Please review our <button onClick={() => navigate('/privacy')} className="text-blue-600 hover:underline">Privacy Policy</button> for full details.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Service Availability</h2>
            <p>We strive to maintain high availability but do not guarantee uninterrupted access. We are not liable for any loss resulting from service downtime, maintenance, or technical issues beyond our control.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, BoostIntake and Acuboost LLC shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Changes to Terms</h2>
            <p>We may update these Terms from time to time. We will notify you of significant changes via email or a notice in the dashboard. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Contact</h2>
            <p>Questions about these Terms? Contact us at: <a href="mailto:hello@boostintake.com" className="text-blue-600 hover:underline">hello@boostintake.com</a></p>
          </section>

        </div>
      </div>
    </div>
  )
}
