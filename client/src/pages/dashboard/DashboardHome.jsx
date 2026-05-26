import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody } from '../../components/ui/Card'
import { API } from '../../lib/api'

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function DashboardHome() {
  const [clinic, setClinic] = useState(null)
  const [billing, setBilling] = useState(null)
  const [stats, setStats] = useState(null)
  const [panel, setPanel] = useState(null) // { type: 'sent'|'completed', range: 'today'|'week'|'month' }
  const [list, setList] = useState([])
  const [listLoading, setListLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('bi_token')
    const headers = { Authorization: `Bearer ${token}` }

    fetch(`${API}/api/clinic/settings`, { headers }).then((r) => r.json()).then(setClinic).catch(() => {})
    fetch(`${API}/api/billing/status`, { headers }).then((r) => r.json()).then(setBilling).catch(() => {})
    fetch(`${API}/api/clinic/stats`, { headers }).then((r) => r.json()).then(setStats).catch(() => {})
  }, [])

  async function openPanel(type, range) {
    setPanel({ type, range })
    setList([])
    setListLoading(true)
    try {
      const res = await fetch(`${API}/api/clinic/list/${type}?range=${range}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
      })
      setList(await res.json())
    } finally {
      setListLoading(false)
    }
  }

  const checklist = [
    { label: 'Configure clinic information', to: '/dashboard/settings', done: !!(clinic?.name && clinic?.address && clinic?.phone) },
    { label: 'Upload clinic logo', to: '/dashboard/settings', done: !!clinic?.logo_url },
    { label: 'Set cancellation policy fees', to: '/dashboard/settings', done: !!(clinic?.cancel_hours && clinic?.no_show_fee) },
    { label: 'Send first patient intake', to: '/dashboard/send', done: (stats?.sent?.month || 0) > 0 },
  ]
  const doneCount = checklist.filter((c) => c.done).length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {clinic?.name ? `Welcome, ${clinic.name}` : 'Dashboard'}
          </h1>
          <p className="text-gray-500 mt-1">Manage your patient intake forms</p>
        </div>
        {billing && (
          <Link to="/dashboard/billing">
            {billing.status === 'active' ? (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Active
              </span>
            ) : billing.trialActive ? (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />Free Trial · {billing.trialDaysLeft}d left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />Trial Expired
              </span>
            )}
          </Link>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/dashboard/send">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-100 hover:border-blue-300">
            <CardBody className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-100 hover:border-blue-300">
            <CardBody className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sent today */}
        <button onClick={() => openPanel('sent', 'today')} className="text-left">
          <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-blue-200">
            <CardBody className="py-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sent Today</p>
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.sent?.today ?? '—'}</p>
              <p className="text-xs text-gray-400 mt-1">
                This week: {stats?.sent?.week ?? '—'} · This month: {stats?.sent?.month ?? '—'}
              </p>
            </CardBody>
          </Card>
        </button>

        {/* Completed today */}
        <button onClick={() => openPanel('completed', 'today')} className="text-left">
          <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-blue-200">
            <CardBody className="py-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed Today</p>
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.completed?.today ?? '—'}</p>
              <p className="text-xs text-gray-400 mt-1">
                This week: {stats?.completed?.week ?? '—'} · This month: {stats?.completed?.month ?? '—'}
              </p>
            </CardBody>
          </Card>
        </button>
      </div>

      {/* Setup checklist */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Setup Checklist</h2>
            <span className="text-sm text-blue-600 font-medium">{doneCount}/{checklist.length} complete</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
          </div>
          <div className="flex flex-col gap-3">
            {checklist.map(({ label, to, done }) => (
              <Link key={label} to={to} className="flex items-center gap-3 group">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${done ? 'bg-blue-500 border-blue-500' : 'border-gray-300 group-hover:border-blue-400'}`}>
                  {done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm flex-1 ${done ? 'text-gray-500' : 'text-gray-700 group-hover:text-blue-700'}`}>{label}</span>
                {!done && (
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Slide-in panel */}
      {panel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPanel(null)} />
          <div className="relative bg-white w-full max-w-sm h-full shadow-2xl flex flex-col">
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  {panel.type === 'sent' ? 'Forms Sent' : 'Forms Completed'}
                </h2>
                <div className="flex gap-2 mt-2">
                  {['today', 'week', 'month'].map((r) => (
                    <button
                      key={r}
                      onClick={() => openPanel(panel.type, r)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        panel.range === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {r === 'today' ? 'Today' : r === 'week' ? 'This Week' : 'This Month'}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setPanel(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Panel list */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {listLoading ? (
                <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
              ) : list.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No records found</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {list.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {panel.type === 'sent'
                            ? `${item.first_name} ${item.last_name}`
                            : item.patient_name || 'Patient'
                          }
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {panel.type === 'sent'
                            ? item.used ? '✓ Completed' : '⏳ Pending'
                            : item.source === 'tablet' ? '🖥 Tablet' : '📱 SMS'
                          }
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {timeAgo(panel.type === 'sent' ? item.created_at : item.submitted_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
