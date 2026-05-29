import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API } from '../../lib/api'

const navItems = [
  { to: '/dashboard', label: 'Home', end: true, icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )},
  { to: '/dashboard/forms', label: 'Forms', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
  { to: '/dashboard/send', label: 'Send Forms', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )},
  { to: '/dashboard/social', label: 'Social Marketing', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  )},
  { to: '/dashboard/settings', label: 'Settings', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
]

export function DashboardLayout() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('bi_token')
    if (!token) { navigate('/login', { replace: true }); return }

    // Cache clinic info for tablet mode
    fetch(`${API}/api/clinic/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data) return
        const existing = JSON.parse(localStorage.getItem('bi_clinic') || '{}')
        localStorage.setItem('bi_clinic', JSON.stringify({
          ...existing,
          clinicId: JSON.parse(atob(token.split('.')[1])).clinicId,
          name: data.name,
          address: data.address,
          phone: data.phone,
          logoUrl: data.logo_url,
          cancelHours: data.cancel_hours,
          noShowFee: data.no_show_fee,
          checkFee: data.check_fee,
          smsTemplate: data.sms_template || '',
          specialty: data.specialty || 'acupuncture',
        }))
      })
      .catch(() => {})

    // Load billing status for trial banner
    fetch(`${API}/api/billing/status`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then(setBilling)
      .catch(() => {})
  }, [])

  const showTrialBanner = billing?.trialActive && billing?.trialDaysLeft <= 7
  const showExpiredBanner = billing && !billing.isActive

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      {/* Trial expiring banner */}
      {showTrialBanner && (
        <div className="bg-blue-600 text-white text-center text-sm py-2 px-4">
          ⏳ Your free trial ends in <strong>{billing.trialDaysLeft} day{billing.trialDaysLeft !== 1 ? 's' : ''}</strong>.{' '}
          <button onClick={() => navigate('/dashboard/billing')} className="underline font-semibold hover:text-blue-200">
            Subscribe now →
          </button>
        </div>
      )}

      {/* Expired banner */}
      {showExpiredBanner && (
        <div className="bg-red-500 text-white text-center text-sm py-2 px-4">
          🔒 Your trial has expired.{' '}
          <button onClick={() => navigate('/dashboard/billing')} className="underline font-semibold hover:text-red-200">
            Subscribe to continue →
          </button>
        </div>
      )}

      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="BoostIntake" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-gray-900">BoostIntake</span>
        </div>
        <button
          onClick={() => { localStorage.removeItem('bi_token'); navigate('/login') }}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          Sign out
        </button>
      </header>

      {/* Main + sidebar */}
      <div className="flex flex-1">
        {/* Sidebar nav (desktop) */}
        <nav className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 p-4 gap-1">
          {navItems.map(({ to, label, end, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}

          <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-1">
            <NavLink
              to="/dashboard/billing"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Billing
            </NavLink>
            <NavLink
              to="/tablet"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Tablet Mode
            </NavLink>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex">
        {navItems.map(({ to, label, end, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors
              ${isActive ? 'text-blue-600' : 'text-gray-500'}`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
