import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody } from '../../components/ui/Card'

export function DashboardHome() {
  const [clinic, setClinic] = useState(null)

  useEffect(() => {
    fetch('/api/clinic/settings', {
      headers: { Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
    })
      .then((r) => r.json())
      .then(setClinic)
      .catch(() => {})
  }, [])

  const checklist = [
    {
      label: 'Configure clinic information',
      to: '/dashboard/settings',
      done: !!(clinic?.name && clinic?.address && clinic?.phone),
    },
    {
      label: 'Upload clinic logo',
      to: '/dashboard/settings',
      done: !!clinic?.logo_url,
    },
    {
      label: 'Set cancellation policy fees',
      to: '/dashboard/settings',
      done: !!(clinic?.cancel_hours && clinic?.no_show_fee),
    },
    {
      label: 'Send first patient intake',
      to: '/dashboard/send',
      done: false,
    },
  ]

  const doneCount = checklist.filter((c) => c.done).length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {clinic?.name ? `Welcome, ${clinic.name}` : 'Dashboard'}
        </h1>
        <p className="text-gray-500 mt-1">Manage your patient intake forms</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/dashboard/send">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-teal-100 hover:border-teal-300">
            <CardBody className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Send Intake Forms</p>
                <p className="text-sm text-gray-500">Send an SMS link to a patient</p>
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link to="/tablet">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-teal-100 hover:border-teal-300">
            <CardBody className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Tablet Mode</p>
                <p className="text-sm text-gray-500">In-clinic self-service intake</p>
              </div>
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Forms Completed Today', value: '—', icon: '📋' },
          { label: 'This Week', value: '—', icon: '📅' },
          { label: 'This Month', value: '—', icon: '📊' },
        ].map(({ label, value, icon }) => (
          <Card key={label}>
            <CardBody className="text-center py-4">
              <p className="text-2xl mb-1">{icon}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Setup checklist */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Setup Checklist</h2>
            <span className="text-sm text-teal-600 font-medium">{doneCount}/{checklist.length} complete</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / checklist.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-3">
            {checklist.map(({ label, to, done }) => (
              <Link key={label} to={to} className="flex items-center gap-3 group">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
                  ${done
                    ? 'bg-teal-500 border-teal-500'
                    : 'border-gray-300 group-hover:border-teal-400'
                  }`}>
                  {done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm flex-1 ${done ? 'text-gray-500' : 'text-gray-700 group-hover:text-teal-700'}`}>
                  {label}
                </span>
                {!done && (
                  <svg className="w-4 h-4 text-gray-400 ml-auto group-hover:text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
