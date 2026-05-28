import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFormStore } from '../../store/formStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { LANGUAGES, useTranslations } from '../../i18n/translations'

export function PatientVerify() {
  const { token } = useParams()
  const navigate = useNavigate()
  const setPatient = useFormStore((s) => s.setPatient)
  const setClinicInfo = useFormStore((s) => s.setClinicInfo)
  const setFormData = useFormStore((s) => s.setFormData)
  const lang = useFormStore((s) => s.lang)
  const setLang = useFormStore((s) => s.setLang)
  const tr = useTranslations(lang)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [branding, setBranding] = useState({ clinicName: null, logoUrl: null })

  // Fetch clinic branding from token on mount
  useEffect(() => {
    fetch(`/api/patient/clinic-info/${token}`)
      .then((r) => r.json())
      .then((d) => { if (d.clinicName) setBranding(d) })
      .catch(() => {})
  }, [token])

  async function handleVerify(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/patient/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, firstName: firstName.trim(), lastName: lastName.trim(), dob }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || tr.verify.error)
        return
      }

      setPatient({ name: `${firstName} ${lastName}`, dob, token })
      setClinicInfo(data.clinic)
      setFormData('patient_info', { firstName: firstName.trim(), lastName: lastName.trim(), dob })
      navigate(`/p/${token}/forms`)
    } catch {
      setError(tr.verify.networkError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Header: clinic name + logo + subtitle */}
        <div className="text-center mb-5">
          {branding.clinicName && (
            <p className="text-2xl font-bold text-gray-700 mb-3">{branding.clinicName}</p>
          )}
          {branding.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={branding.clinicName || 'Clinic'}
              className="w-20 h-20 object-contain rounded-2xl mx-auto mb-3"
            />
          ) : (
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{tr.verify.title}</p>
          <p className="text-gray-400 mt-0.5 text-xs">{tr.verify.subtitle}</p>
        </div>

        {/* Language selector */}
        <div className="flex justify-center gap-2 mb-5">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                lang === l.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Verify form */}
        <form onSubmit={handleVerify} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <Input
              label={tr.verify.firstName}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First"
              required
              autoFocus
              className="flex-1"
            />
            <Input
              label={tr.verify.lastName}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last"
              required
              className="flex-1"
            />
          </div>
          <Input
            label={tr.verify.dob}
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" disabled={loading || !firstName || !lastName || !dob}>
            {loading ? tr.verify.submitting : tr.verify.submit}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          {tr.verify.footer}
        </p>
      </div>
    </div>
  )
}
