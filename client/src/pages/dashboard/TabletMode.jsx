import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormStore } from '../../store/formStore'
import { PatientForms } from '../patient/PatientForms'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { FormSelector, DEFAULT_FORM_IDS } from '../../components/forms/FormSelector'
import { FORM_CATALOG } from '../../forms/catalog'
import { API } from '../../lib/api'
import { LANGUAGES, useTranslations } from '../../i18n/translations'

const TABLET_STATES = {
  LOCATION: 'location', // Staff selects location (if multi-location)
  SETUP: 'setup',       // Staff selects forms
  IDLE: 'idle',         // Patient enters name/DOB
  PATIENT: 'patient',   // Patient fills forms
  COMPLETE: 'complete', // Done — PIN lock screen
}


export function TabletMode() {
  const navigate = useNavigate()
  const { setPatient, setClinicInfo, setFormData, setLang, setSelectedFormIds, lang, reset } = useFormStore()
  const tr = useTranslations(lang)
  const saved = JSON.parse(localStorage.getItem('bi_clinic') || '{}')
  const secondaryLocations = saved.locations || []
  const allLocations = [
    { name: saved.name || 'Main Office', address: saved.address || '' },
    ...secondaryLocations,
  ]
  const hasMultipleLocations = secondaryLocations.length > 0

  const [state, setState] = useState(hasMultipleLocations ? TABLET_STATES.LOCATION : TABLET_STATES.SETUP)
  const [selectedLocation, setSelectedLocation] = useState(allLocations[0])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')       // display: MM/DD/YYYY
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [selectedFormIds, setSelectedFormIdsLocal] = useState(DEFAULT_FORM_IDS)
  const [availableForms, setAvailableForms] = useState([])

  // Load available forms once on mount
  useEffect(() => {
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

  function handleSetupContinue() {
    // Store selected form IDs in the global store so PatientForms filters correctly
    setSelectedFormIds(selectedFormIds)
    setState(TABLET_STATES.IDLE)
  }

  function handleStart(e) {
    e.preventDefault()
    setPatient({ name: `${firstName} ${lastName}`, dob, token: 'tablet' })
    const clinicBase = JSON.parse(localStorage.getItem('bi_clinic') || '{}')
    setClinicInfo({ ...clinicBase, name: selectedLocation.name, address: selectedLocation.address })
    // Pre-fill patient_info form with the entered name and DOB
    setFormData('patient_info', { firstName, lastName, dob })
    setState(TABLET_STATES.PATIENT)
  }

  function handleFormComplete() {
    setState(TABLET_STATES.COMPLETE)
  }

  async function handlePinUnlock(e) {
    e.preventDefault()
    const { clinicId } = JSON.parse(localStorage.getItem('bi_clinic') || '{}')

    if (!clinicId) {
      setPinError('Tablet not set up. Please log in to dashboard first.')
      return
    }

    try {
      const res = await fetch(`${API}/api/clinic/tablet-verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicId, pin }),
      })
      const { ok } = await res.json()
      if (ok) {
        reset()
        setFirstName(''); setLastName(''); setDob(''); setPin('')
        setPinError('')
        setSelectedFormIdsLocal(DEFAULT_FORM_IDS)
        setSelectedLocation(allLocations[0])
        setState(hasMultipleLocations ? TABLET_STATES.LOCATION : TABLET_STATES.SETUP)
      } else {
        setPinError('Incorrect PIN')
        setPin('')
      }
    } catch {
      setPinError('Connection error. Try again.')
      setPin('')
    }
  }

  // LOCATION state — staff selects which location this tablet is at
  if (state === TABLET_STATES.LOCATION) {
    return (
      <div className="min-h-dvh bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-xl mx-auto">
            <h1 className="text-lg font-bold text-gray-900">Select Location</h1>
            <p className="text-sm text-gray-500 mt-0.5">Which office is this tablet at?</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm flex flex-col gap-3">
            {allLocations.map((loc, i) => (
              <button
                key={i}
                onClick={() => { setSelectedLocation(loc); setState(TABLET_STATES.SETUP) }}
                className="w-full text-left px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <p className="font-semibold text-gray-900">{loc.name}</p>
                {loc.address && <p className="text-sm text-gray-500 mt-0.5">{loc.address}</p>}
              </button>
            ))}
          </div>
        </div>
        <div className="text-center pb-6">
          <button onClick={() => navigate('/dashboard')} className="text-xs text-gray-400 hover:text-gray-600 underline">
            Staff: Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // SETUP state — staff selects forms
  if (state === TABLET_STATES.SETUP) {
    return (
      <div className="min-h-dvh bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="max-w-xl mx-auto">
            <h1 className="text-lg font-bold text-gray-900">Select Forms for This Patient</h1>
            <p className="text-sm text-gray-500 mt-0.5">Choose which forms this patient needs to complete.</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="max-w-xl mx-auto">
            <FormSelector
              availableForms={availableForms}
              selectedIds={selectedFormIds}
              onChange={setSelectedFormIdsLocal}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {selectedFormIds.length} form{selectedFormIds.length !== 1 ? 's' : ''} selected
            </p>
            <Button size="md" onClick={handleSetupContinue}>
              Continue →
            </Button>
          </div>
        </div>

        <div className="text-center pb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Staff: Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (state === TABLET_STATES.PATIENT) {
    return (
      <div className="relative">
        <TabletPatientWrapper onComplete={handleFormComplete} />
      </div>
    )
  }

  if (state === TABLET_STATES.COMPLETE) {
    return (
      <div className="min-h-dvh bg-blue-600 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xs text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Forms Submitted!</h1>
          <p className="text-blue-100 mb-8">Please return this tablet to the front desk.</p>

          <form onSubmit={handlePinUnlock} className="flex flex-col gap-3">
            <p className="text-blue-200 text-sm">Staff PIN to return to home screen:</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setPinError('') }}
              placeholder="Enter PIN"
              autoFocus
              className="w-full px-4 py-4 rounded-2xl text-center text-2xl tracking-widest font-mono bg-white/20 text-white placeholder-blue-300 border-2 border-white/30 focus:outline-none focus:border-white"
            />
            {pinError && <p className="text-red-300 text-sm">{pinError}</p>}
            <Button type="submit" variant="secondary" size="md" disabled={pin.length < 4}>
              Unlock
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // IDLE state — patient enters name/DOB
  return (
    <div className="min-h-dvh bg-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Header: clinic name + logo + subtitle */}
        {(() => {
          const saved = JSON.parse(localStorage.getItem('bi_clinic') || '{}')
          return (
            <div className="text-center mb-5">
              {selectedLocation.name && (
                <p className="text-2xl font-bold text-gray-600 mb-3">{selectedLocation.name}</p>
              )}
              {saved.logoUrl ? (
                <img src={saved.logoUrl} alt={selectedLocation.name || 'Clinic'} className="w-20 h-20 object-contain rounded-2xl mx-auto mb-3" />
              ) : (
                <img src="/logo.png" alt="BoostIntake" className="w-20 h-20 object-contain mx-auto mb-3" />
              )}
              <p className="text-sm text-gray-500">{tr.verify.subtitle}</p>
            </div>
          )
        })()}

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

        <form onSubmit={handleStart} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <Input label={tr.verify.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First" required className="flex-1" autoFocus />
            <Input label={tr.verify.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last" required className="flex-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">{tr.verify.dob}</label>
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

          <Button type="submit" size="lg" disabled={!firstName || !lastName || !isDobComplete(dob)}>
            {tr.verify.submit}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setState(TABLET_STATES.SETUP)}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Back to form selection
          </button>
        </div>
      </div>
    </div>
  )
}

// Wrapper that intercepts form completion in tablet mode
function TabletPatientWrapper({ onComplete }) {
  return <PatientForms isTablet onTabletComplete={onComplete} />
}
