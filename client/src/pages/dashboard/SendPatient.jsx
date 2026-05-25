import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { API } from '../../lib/api'

export function SendPatient() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`${API}/api/patient/send-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bi_token')}`,
        },
        body: JSON.stringify({ firstName, lastName, phone, dob }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to send'); return }
      setResult(data)
      // Clear form
      setFirstName(''); setLastName(''); setPhone(''); setDob('')
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function formatPhone(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Send Intake Forms</h1>
        <p className="text-gray-500 mt-1">The patient will receive an SMS with a secure link</p>
      </div>

      {result ? (
        <Card className="border-teal-200">
          <CardBody>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Link Sent!</p>
                <p className="text-sm text-gray-500">SMS delivered to {result.phone}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">Intake link (expires in 24 hours)</p>
              <p className="text-sm font-mono text-teal-700 break-all">{result.link}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(result.link)}
              >
                Copy Link
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResult(null)}
              >
                Send Another
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader title="Patient Information" subtitle="Enter the patient's details to generate a unique intake link" />
          <CardBody>
            <form onSubmit={handleSend} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First"
                  required
                  autoFocus
                  className="flex-1"
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last"
                  required
                  className="flex-1"
                />
              </div>
              <Input
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
              <Input
                label="Mobile Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(555) 000-0000"
                required
              />

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                <strong>Privacy:</strong> The patient will verify their identity by entering their name and date of birth before accessing the forms. The link expires in 24 hours.
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
              )}

              <Button type="submit" size="lg" disabled={loading || !firstName || !lastName || !phone || !dob}>
                {loading ? 'Sending...' : 'Send Intake Link via SMS →'}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-teal-50 border-teal-100">
        <CardBody>
          <h3 className="font-semibold text-teal-900 mb-2">How it works</h3>
          <ol className="text-sm text-teal-800 flex flex-col gap-2 list-decimal list-inside">
            <li>Patient receives an SMS with a secure link</li>
            <li>They verify identity with name + date of birth</li>
            <li>Complete all intake forms and sign digitally</li>
            <li>PDF is generated and emailed to your clinic instantly</li>
            <li>All PHI is deleted from our servers immediately</li>
          </ol>
        </CardBody>
      </Card>
    </div>
  )
}
