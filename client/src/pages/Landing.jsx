import { useNavigate } from 'react-router-dom'

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="BoostIntake" className="w-8 h-8 object-contain" />
            <span className="font-bold text-gray-900 text-lg">BoostIntake</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            14-Day Free Trial · No Credit Card Required
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Intake forms done<br />
            <span className="text-blue-600">before patients walk in.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Send a secure link via SMS — patients sign everything at home, you get the PDF instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Start Free Trial →
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              Sign In
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">No setup fees · Cancel anytime</p>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sound familiar?</h2>
          <p className="text-gray-500 mb-12 text-lg">Every clinic deals with this — it doesn't have to be this way.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: '⏰', title: 'New patients fill out forms in the waiting room', desc: 'They arrive early, sit down with a clipboard, and your front desk waits.' },
              { icon: '🖨️', title: 'Staff scans and files every form', desc: 'Someone has to scan it, name the file, and save it — every single patient.' },
              { icon: '🗂️', title: 'Paper files pile up', desc: 'Storage space, misfiled records, and a compliance headache you don\'t need.' },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6 text-left">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-500 mb-14 text-lg">Three steps. That's it.</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'You send a link', desc: 'Enter the patient\'s name and phone number. They get a secure SMS link in seconds.' },
              { step: '2', title: 'Patient completes forms', desc: 'On their phone, before the appointment. All forms signed digitally.' },
              { step: '3', title: 'PDF lands in your inbox', desc: 'The moment they submit, a complete PDF is emailed to your clinic automatically.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-4 shadow-lg shadow-blue-200">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything your clinic needs</h2>
            <p className="text-gray-500 text-lg">Built specifically for small medical clinics.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: '📱', title: 'SMS delivery', desc: 'Patients receive a secure link via text — no app download needed.' },
              { icon: '✍️', title: 'Digital signatures', desc: 'HIPAA consent, financial policy, arbitration — all signed on their phone.' },
              { icon: '📄', title: 'Instant PDF', desc: 'Auto-generated PDF emailed to your clinic the moment forms are submitted.' },
              { icon: '💊', title: 'Intake-ready forms', desc: 'Health history, review of systems, HIPAA, financial policy and more — included.' },
              { icon: '🖥️', title: 'Tablet mode', desc: 'Patients fill out forms on an in-office tablet — same seamless experience.' },
              { icon: '🔒', title: 'Privacy first', desc: 'All patient data is deleted from our servers immediately after submission.' },
              { icon: '🏥', title: 'Multi-location support', desc: 'Run up to 2 clinic locations from a single account. Each location gets its own branded forms and PDF header.' },
              { icon: '🎨', title: 'Branded patient experience', desc: 'Patients see your clinic name and logo from the very first screen — a professional experience that builds trust.' },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                <div className="text-2xl flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SNS Marketing teaser */}
      <section className="px-6 py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
              Coming Soon
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-powered social media — built for your clinic</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              No more staring at a blank screen. BoostIntake knows your specialty and does the creative work for you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {[
              {
                icon: '💡',
                title: 'Smart content ideas',
                desc: 'Based on your specialty — acupuncture, chiropractic, and more — AI nudges you with timely post ideas your patients actually care about.',
              },
              {
                icon: '✨',
                title: 'AI-generated captions & hashtags',
                desc: 'One click and your post is ready. AI writes the caption and picks the right hashtags so you can focus on patient care.',
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-indigo-500 font-medium mt-8">
            Marketing add-on launching soon — included free for early subscribers.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 bg-blue-50">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple pricing</h2>
          <p className="text-gray-500 mb-10 text-lg">One plan. Everything included. No surprises.</p>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
            <div className="flex justify-center gap-2 mb-8">
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Monthly</span>
              <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">Annual — save 25%</span>
            </div>

            <div className="mb-2">
              <span className="text-5xl font-extrabold text-gray-900">$19</span>
              <span className="text-2xl font-bold text-gray-900">.99</span>
              <span className="text-gray-400 ml-1">/month</span>
            </div>
            <p className="text-gray-400 text-sm mb-8">or $179/year (~$14.99/mo)</p>

            <ul className="text-left flex flex-col gap-3 mb-8">
              {[
                'Unlimited intake form sends',
                'All form types included',
                'Instant PDF to your email',
                'Digital signatures',
                'Tablet mode',
                'Up to 2 clinic locations',
                'Branded patient verification screen',
                'Customizable SMS message',
                'Clinic logo & info on every PDF',
                'Cancel anytime',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('/register')}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Start 14-Day Free Trial
            </button>
            <p className="text-xs text-gray-400 mt-3">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-24 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to get forms done before they walk in?
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            Join clinics already using BoostIntake to streamline their intake process.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            Start Free Trial →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="BoostIntake" className="w-6 h-6 object-contain" />
            <span className="text-gray-400 text-sm">BoostIntake © 2025</span>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm">Privacy</a>
            <a href="/terms" className="text-gray-500 hover:text-gray-300 text-sm">Terms</a>
            <a href="mailto:hello@boostintake.com" className="text-gray-500 hover:text-gray-300 text-sm">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
