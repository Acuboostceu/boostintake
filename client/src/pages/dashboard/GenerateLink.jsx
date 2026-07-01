import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { FormSelector, DEFAULT_FORM_IDS } from '../../components/forms/FormSelector'
import { FORM_CATALOG } from '../../forms/catalog'
import { API } from '../../lib/api'

export function GenerateLink() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedFormIds, setSelectedFormIds] = useState(DEFAULT_FORM_IDS)
  const [availableForms, setAvailableForms] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [clinicInfo, setClinicInfo] = useState({ name: '', locations: [] })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bi_clinic') || '{}')
    setClinicInfo({ name: saved.name || '', locations: saved.locations || [] })

    fetch(`${API}/api/forms`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('bi_token')}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const enabled = data?.enabled || []
        const custom = data?.custom || []
        const ids = new Set([
          ...enabled.map((f) => f.form_id),
          ...custom.map((f) => f.id),
        ])
        const forms = FORM_CATALOG.filter((f) => ids.has(f.id) && !f.comingSoon)
        setAvailableForms(forms.length > 0 ? forms : FORM_CATALOG.filter((f) => !f.comingSoon))
      })
      .catch(() => setAvailableForms(FORM_CATALOG.filter((f) => !f.comingSoon)))
  }, [])

  function handleDobInput(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 8)
    let formatted = digits
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`
    setDob(formatted)
  }

  function isDobComplete(val) {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(val)
  }

  async function handleGenerate(e) {
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
        body: JSON.stringify({
          firstName,
          lastName,
          dob,
          formIds: selectedFormIds,
          locationName: selectedLocation?.name || null,
          locationAddress: selectedLocation?.address || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to generate link'); return }
      setResult(data)
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleReset() {
    setResult(null)
    setFirstName('')
    setLastName('')
    setDob('')
    setSelectedFormIds(DEFAULT_FORM_IDS)
    setCopied(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Intake Link</h1>
        <p className="text-gray-500 mt-1">Create a secure link to text or share with your patient</p>
      </div>

      {result ? (
        <Card className="border-blue-200">
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Link Ready!</p>
                <p className="text-sm text-gray-500">Copy and text this link to {firstName} {lastName}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Intake link — expires in 24 hours</p>
              <p className="text-sm font-mono text-blue-700 break-all leading-relaxed">{result.link}</p>
            </div>

            <Button size="lg" onClick={handleCopy} className="w-full">
              {copied ? '✓ Copied!' : 'Copy Link'}
            </Button>

            <p className="text-xs text-gray-400 text-center">
              Paste this link into a text message and send from your phone
            </p>

            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 text-center underline"
            >
              Generate another link
            </button>
          </CardBody>
        </Card>
      ) : (
        <form onSubmit={handleGenerate} className="flex flex-col gap-6">
          {/* Location selector */}
          {clinicInfo.locations?.length > 0 && (
            <Card>
              <CardBody className="py-3.5">
                <div className="flex items-center gap-6 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900">Location</span>
                  <div className="flex gap-2 flex-wrap">
                    {[{ name: clinicInfo.name }, ...clinicInfo.locations].map((loc, i) => {
                      const isSelected = (i === 0 && selectedLocation === null) || (i > 0 && selectedLocation?.name === loc.name)
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedLocation(i === 0 ? null : loc)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {loc.name || `Location ${i + 1}`}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Patient Information" subtitle="Enter the patient's details to generate a unique intake link" />
            <CardBody className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First" required autoFocus className="flex-1" />
                <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last" required className="flex-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Date of Birth</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={dob}
                  onChange={(e) => handleDobInput(e.target.value)}
                  placeholder="MM/DD/YYYY"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg tracking-widest font-mono"
                  required
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Forms for This Patient"
              subtitle={`${selectedFormIds.length} form${selectedFormIds.length !== 1 ? 's' : ''} selected`}
            />
            <CardBody>
              <FormSelector
                availableForms={availableForms}
                selectedIds={selectedFormIds}
                onChange={setSelectedFormIds}
              />
            </CardBody>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>Privacy:</strong> The patient verifies their identity with name + date of birth before accessing forms. The link expires in 24 hours.
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <Button type="submit" size="lg" disabled={loading || !firstName || !lastName || !isDobComplete(dob)}>
            {loading ? 'Generating...' : 'Generate Intake Link →'}
          </Button>
        </form>
      )}
    </div>
  )
}
