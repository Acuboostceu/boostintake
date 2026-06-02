import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { FormSelector, DEFAULT_FORM_IDS } from '../../components/forms/FormSelector'
import { FORM_CATALOG } from '../../forms/catalog'
import { API } from '../../lib/api'

const DEFAULT_TEMPLATE = `Hi {firstName}! This is {clinicName}. Please complete your intake forms before your appointment: {link} (Link expires in 24 hours)`


export function SendPatient({ embedPrefill = null }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clinicInfo, setClinicInfo] = useState({ name: '', template: '' })
  const [customMessage, setCustomMessage] = useState('')
  const [selectedFormIds, setSelectedFormIds] = useState(DEFAULT_FORM_IDS)
  const [availableForms, setAvailableForms] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null) // null = primary

  // Pre-fill patient info when opened from EHR embed
  useEffect(() => {
    if (embedPrefill) {
      if (embedPrefill.firstName) setFirstName(embedPrefill.firstName)
      if (embedPrefill.lastName)  setLastName(embedPrefill.lastName)
      if (embedPrefill.phone)     setPhone(formatPhone(embedPrefill.phone))
      if (embedPrefill.dob)       setDob(embedPrefill.dob)
    }
  }, [embedPrefill])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bi_clinic') || '{}')
    setClinicInfo({ name: saved.name || '', template: saved.smsTemplate || '', locations: saved.locations || [] })

    // Load available forms for this clinic
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
      .catch(() => {
        setAvailableForms(FORM_CATALOG.filter((f) => !f.comingSoon))
      })
  }, [])

  // Build live preview (link shown as placeholder until sent)
  const previewLink = 'https://boostintake.com/p/xxxxxx'
  const template = customMessage || clinicInfo.template || DEFAULT_TEMPLATE
  const preview = template
    .replace('{firstName}', firstName || 'Patient')
    .replace('{clinicName}', clinicInfo.name || 'Your Clinic')
    .replace('{link}', previewLink)

  async function handleSend(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setResult(null)

    try {
      // Send template as-is — server replaces {firstName}, {clinicName}, {link}
      const res = await fetch(`${API}/api/patient/send-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bi_token')}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          dob,
          customMessage: customMessage || template,
          formIds: selectedFormIds,
          locationName: selectedLocation?.name || null,
          locationAddress: selectedLocation?.address || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to send'); return }
      setResult(data)
      setFirstName(''); setLastName(''); setPhone(''); setDob('')
      setCustomMessage('')
      setSelectedFormIds(DEFAULT_FORM_IDS)
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  function formatPhone(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  }

  const extraSelected = selectedFormIds.filter((id) => !DEFAULT_FORM_IDS.includes(id))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Send Intake Forms</h1>
        <p className="text-gray-500 mt-1">The patient will receive an SMS with a secure link</p>
      </div>

      {result ? (
        <Card className="border-blue-200">
          <CardBody>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              <p className="text-sm font-mono text-blue-700 break-all">{result.link}</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(result.link)}>
                Copy Link
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setResult(null)}>
                Send Another
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <form onSubmit={handleSend} className="flex flex-col gap-6">
          {/* Location selector — only shown if multi-location configured */}
          {clinicInfo.locations?.length > 0 && (
            <Card>
              <CardBody className="py-3.5">
                <div className="flex items-center gap-6 flex-wrap">
                  <span className="text-xl font-bold text-gray-900">Location</span>
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
              <Input label="Mobile Phone Number" type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="(555) 000-0000" required />
            </CardBody>
          </Card>

          {/* Form Selection */}
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

          {/* SMS Message */}
          <Card>
            <CardHeader title="SMS Message" subtitle="Edit the message for this patient if needed" />
            <CardBody className="flex flex-col gap-3">
              <textarea
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={template}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm resize-none"
              />
              <p className="text-xs text-gray-400">
                Variables: <code className="bg-gray-100 px-1 rounded">{'{firstName}'}</code> <code className="bg-gray-100 px-1 rounded">{'{clinicName}'}</code> <code className="bg-gray-100 px-1 rounded">{'{link}'}</code> — leave blank to use your saved template
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <p className="text-xs font-medium text-blue-600 mb-1">PREVIEW</p>
                <p className="text-sm text-gray-700">{preview}</p>
              </div>
            </CardBody>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>Privacy:</strong> The patient verifies their identity with name + date of birth before accessing forms. The link expires in 24 hours.
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <Button type="submit" size="lg" disabled={loading || !firstName || !lastName || !phone || !isDobComplete(dob)}>
            {loading ? 'Sending...' : 'Send Intake Link via SMS →'}
          </Button>
        </form>
      )}

      {/* Info */}
      <Card className="bg-blue-50 border-blue-100">
        <CardBody>
          <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
          <ol className="text-sm text-blue-800 flex flex-col gap-2 list-decimal list-inside">
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
