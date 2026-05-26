import { useState } from 'react'
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
  const lang = useFormStore((s) => s.lang)
  const setLang = useFormStore((s) => s.setLang)
  const tr = useTranslations(lang)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

        {/* Language selector */}
        <div className="flex justify-center gap-2 mb-6">
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

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{tr.verify.title}</h1>
          <p className="text-gray-500 mt-1 text-sm">{tr.verify.subtitle}</p>
        </div>

        {/* Verify form */}
        <form onSubmit={handleVerify} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <Input
              label={tr.verify.firstName}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={tr.verify.firstPlaceholder}
              required
              autoFocus
              className="flex-1"
            />
            <Input
              label={tr.verify.lastName}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={tr.verify.lastPlaceholder}
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
