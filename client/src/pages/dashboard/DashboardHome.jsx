import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardBody } from '../../components/ui/Card'
import { API } from '../../lib/api'
import { FOCUS_AREAS } from './SocialSetup'

const NUDGE_IDEAS = {
  pain_mgmt: ['Share how acupuncture helps relieve chronic back pain', 'Post a patient success story about pain relief'],
  fertility: ['Educate your audience on acupuncture and women\'s health', 'Share a fertility treatment success story'],
  digestive: ['Post about acupuncture points that support digestive health'],
  sleep: ['Share natural remedies for insomnia with acupuncture'],
  stress: ['Explain how acupuncture reduces cortisol and stress'],
  cosmetic: ['Debunk myths about facial acupuncture'],
  disc: ['Share daily habits that protect your spine'],
  posture: ['Share posture tips for remote workers'],
  sports_injury: ['Show how chiropractic speeds up sports recovery'],
  headache: ['Explain the link between neck alignment and headaches'],
  postpartum: ['Explain how chiropractic helps postpartum recovery'],
  pediatric: ['Share the benefits of chiropractic for kids\' development'],
  deep_tissue: ['Explain the benefits of deep tissue massage for muscle recovery'],
  prenatal: ['Reassure expecting moms about the safety of prenatal massage'],
  sports_massage: ['Post a pre/post workout massage routine'],
  relaxation: ['Share the stress-relief benefits of relaxation massage'],
  lymphatic: ['Educate on how lymphatic drainage reduces swelling'],
  hot_stone: ['Showcase the healing power of hot stone therapy'],
}

function pickNudge(areas) {
  if (!areas?.length) return null
  const id = areas[Math.floor(Math.random() * areas.length)]
  const ideas = NUDGE_IDEAS[id]
  if (!ideas) return null
  return { id, text: ideas[Math.floor(Math.random() * ideas.length)] }
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function Skeleton({ className = '' }) {
  return <div className={`bg-gray-100 rounded-lg animate-pulse ${className}`} />
}

export function DashboardHome() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [nudge, setNudge] = useState(null)
  const [panel, setPanel] = useState(null)
  const [list, setList] = useState([])
  const [listLoading, setListLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/clinic/dashboard`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        if (d?.socialSettings?.focusAreas?.length) {
          setNudge(pickNudge(d.socialSettings.focusAreas))
        }
      })
      .catch(() => {})
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

  const clinic = data?.clinic
  const billing = data?.billing
  const stats = data?.stats

  const checklist = [
    { label: 'Configure clinic information', to: '/dashboard/settings', done: !!(clinic?.name && clinic?.address && clinic?.phone) },
    { label: 'Upload clinic logo', to: '/dashboard/settings', done: !!clinic?.logo_url },
    { label: 'Set cancellation policy fees', to: '/dashboard/settings', done: !!(clinic?.cancel_hours && clinic?.no_show_fee) },
    { label: 'Send first patient intake', to: '/dashboard/send', done: (stats?.sent?.month || 0) > 0 },
  ]
  const doneCount = checklist.filter((c) => c.done).length

  const loading = !data

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {loading ? (
            <>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-56" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">
                {clinic?.name ? `Welcome, ${clinic.name}` : 'Dashboard'}
              </h1>
              <p className="text-gray-500 mt-1">Manage your patient intake forms</p>
            </>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-7 w-24 rounded-full" />
        ) : billing ? (
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
        ) : null}
      </div>

      {/* Social nudge */}
      {loading ? (
        <Skeleton className="h-20 w-full rounded-2xl" />
      ) : nudge ? (
        <button
          onClick={() => navigate('/dashboard/social')}
          className="w-full text-left bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200 rounded-2xl px-5 py-4 flex items-start gap-4 hover:border-violet-400 transition-colors"
        >
          <span className="text-2xl flex-shrink-0">💡</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-violet-600 mb-1">Post idea for this week</p>
            <p className="text-sm text-gray-800 font-medium leading-snug">{nudge.text}</p>
          </div>
          <svg className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : null}

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
        <button onClick={() => !loading && openPanel('sent', 'today')} className="text-left" disabled={loading}>
          <Card className={`transition-shadow ${!loading ? 'hover:shadow-md cursor-pointer hover:border-blue-200' : ''}`}>
            <CardBody className="py-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sent Today</p>
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              {loading ? (
                <>
                  <Skeleton className="h-9 w-12 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-900">{stats?.sent?.today ?? 0}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    This week: {stats?.sent?.week ?? 0} · This month: {stats?.sent?.month ?? 0}
                  </p>
                </>
              )}
            </CardBody>
          </Card>
        </button>

        <button onClick={() => !loading && openPanel('completed', 'today')} className="text-left" disabled={loading}>
          <Card className={`transition-shadow ${!loading ? 'hover:shadow-md cursor-pointer hover:border-blue-200' : ''}`}>
            <CardBody className="py-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed Today</p>
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              {loading ? (
                <>
                  <Skeleton className="h-9 w-12 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-900">{stats?.completed?.today ?? 0}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    This week: {stats?.completed?.week ?? 0} · This month: {stats?.completed?.month ?? 0}
                  </p>
                </>
              )}
            </CardBody>
          </Card>
        </button>
      </div>

      {/* Setup checklist */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Setup Checklist</h2>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className="text-sm text-blue-600 font-medium">{doneCount}/{checklist.length} complete</span>
            )}
          </div>
          {loading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-1.5 w-full rounded-full mb-2" />
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-5 w-full" />)}
            </div>
          ) : (
            <>
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
            </>
          )}
        </CardBody>
      </Card>

      {/* Slide-in panel */}
      {panel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPanel(null)} />
          <div className="relative bg-white w-full max-w-sm h-full shadow-2xl flex flex-col">
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

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {listLoading ? (
                <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
              ) : list.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No records found</p>
              ) : (
                <div className="flex flex-col">
                  {list.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {panel.type === 'sent'
                            ? `${item.first_name} ${item.last_name}`
                            : item.patient_name || 'Patient'
                          }
                        </p>
                        {panel.type === 'sent' ? (
                          item.used
                            ? <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">Completed</span>
                            : (Date.now() - new Date(item.created_at) > 24 * 60 * 60 * 1000)
                              ? <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">Expired</span>
                              : <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">Waiting</span>
                        ) : (
                          item.source === 'tablet'
                            ? <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Tablet</span>
                            : <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">SMS</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0">
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
