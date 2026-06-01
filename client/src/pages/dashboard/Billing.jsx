import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { API } from '../../lib/api'

export function Billing() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/billing/status`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
    })
      .then((r) => r.json())
      .then(setStatus)
      .finally(() => setLoading(false))
  }, [])

  async function handleCheckout(plan) {
    setCheckoutLoading(plan)
    try {
      const res = await fetch(`${API}/api/billing/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bi_token')}`,
        },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.message || 'Checkout failed — no redirect URL returned.')
      }
    } catch (e) {
      alert('Failed to start checkout: ' + (e.message || 'Connection error'))
    } finally {
      setCheckoutLoading('')
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch(`${API}/api/billing/portal`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Failed to open billing portal.')
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>

  const isActive = status?.status === 'active'
  const isTrial = status?.trialActive
  const isExpired = !isActive && !isTrial

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">Manage your subscription</p>
      </div>

      {/* Current status */}
      <Card>
        <CardHeader title="Current Plan" />
        <CardBody>
          {isActive && (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <div>
                <p className="font-semibold text-gray-900">Active Subscription</p>
                <p className="text-sm text-gray-500">Your plan is active. Thank you!</p>
              </div>
            </div>
          )}
          {isTrial && (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <div>
                <p className="font-semibold text-gray-900">Free Trial</p>
                <p className="text-sm text-gray-500">
                  {status.trialDaysLeft} day{status.trialDaysLeft !== 1 ? 's' : ''} remaining — subscribe to keep access after your trial.
                </p>
              </div>
            </div>
          )}
          {isExpired && (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <div>
                <p className="font-semibold text-gray-900">Trial Expired</p>
                <p className="text-sm text-gray-500">Subscribe below to continue using BoostIntake.</p>
              </div>
            </div>
          )}

          {isActive && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={handlePortal} disabled={portalLoading}>
                {portalLoading ? 'Loading...' : 'Manage Subscription →'}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Plans — show when not active */}
      {!isActive && (
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Monthly */}
          <Card className="border-gray-200">
            <CardBody>
              <p className="text-sm font-medium text-gray-500 mb-1">Monthly</p>
              <div className="mb-4">
                <span className="text-4xl font-extrabold text-gray-900">$19</span>
                <span className="text-xl font-bold text-gray-900">.99</span>
                <span className="text-gray-400 text-sm"> /month</span>
              </div>
              <ul className="flex flex-col gap-2 mb-6 text-sm text-gray-600">
                {['Unlimited form sends', 'Instant PDF delivery', 'Digital signatures', 'Tablet mode', 'Cancel anytime'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Button size="md" onClick={() => handleCheckout('monthly')} disabled={!!checkoutLoading} className="w-full">
                {checkoutLoading === 'monthly' ? 'Loading...' : 'Subscribe Monthly'}
              </Button>
            </CardBody>
          </Card>

          {/* Yearly */}
          <Card className="border-blue-300 bg-blue-50/30">
            <CardBody>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-500">Annual</p>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">Save 25%</span>
              </div>
              <div className="mb-1">
                <span className="text-4xl font-extrabold text-gray-900">$179</span>
                <span className="text-gray-400 text-sm"> /year</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">~$14.99/month</p>
              <ul className="flex flex-col gap-2 mb-6 text-sm text-gray-600">
                {['Everything in Monthly', 'Best value', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Button size="md" onClick={() => handleCheckout('yearly')} disabled={!!checkoutLoading} className="w-full">
                {checkoutLoading === 'yearly' ? 'Loading...' : 'Subscribe Annually'}
              </Button>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  )
}
