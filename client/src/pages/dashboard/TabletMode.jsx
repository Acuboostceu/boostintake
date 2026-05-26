import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormStore } from '../../store/formStore'
import { PatientForms } from '../patient/PatientForms'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { API } from '../../lib/api'

const TABLET_STATES = {
  IDLE: 'idle',       // Waiting screen — shown to staff
  PATIENT: 'patient', // Patient fills forms
  COMPLETE: 'complete', // Done — PIN lock screen
}

export function TabletMode() {
  const navigate = useNavigate()
  const { setPatient, setClinicInfo, setFormData, reset } = useFormStore()
  const [state, setState] = useState(TABLET_STATES.IDLE)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')       // display: MM/DD/YYYY
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

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

  function handleStart(e) {
    e.preventDefault()
    setPatient({ name: `${firstName} ${lastName}`, dob, token: 'tablet' })
    const saved = JSON.parse(localStorage.getItem('bi_clinic') || '{}')
    setClinicInfo(saved)
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
        setState(TABLET_STATES.IDLE)
      } else {
        setPinError('Incorrect PIN')
        setPin('')
      }
    } catch {
      setPinError('Connection error. Try again.')
      setPin('')
    }
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

  // IDLE state
  return (
    <div className="min-h-dvh bg-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="BoostIntake" className="w-24 h-24 mx-auto mb-2 object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-500 mt-1 text-sm">Please enter your information to begin your intake forms</p>
        </div>

        <form onSubmit={handleStart} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First" required className="flex-1" autoFocus />
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

          <Button type="submit" size="lg" disabled={!firstName || !lastName || !isDobComplete(dob)}>
            Begin Intake Forms →
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Staff: Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

// Wrapper that intercepts form completion in tablet mode
function TabletPatientWrapper({ onComplete }) {
  // We need to override the navigate call in PatientForms
  // Simplest approach: render PatientForms but watch for the /complete route
  // Since tablet uses token='tablet', we hook into the submit via a custom approach

  // For tablet mode, override submit to call onComplete instead of navigating
  const store = useFormStore()

  // Patch: override patient token to 'tablet' so PatientForms can be reused
  // The submit handler in PatientForms already calls /api/patient/submit
  // For tablet, we replace the navigate in PatientForms by listening to store
  // This is handled by PatientForms checking token === 'tablet' on the server

  return <PatientForms isTablet onTabletComplete={onComplete} />
}
