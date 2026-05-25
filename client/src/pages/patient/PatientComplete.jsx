import { useEffect } from 'react'
import { useFormStore } from '../../store/formStore'

export function PatientComplete() {
  const { clinicInfo, reset } = useFormStore()

  // Clear all PHI from memory after showing complete screen
  useEffect(() => {
    const timer = setTimeout(() => reset(), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-dvh bg-teal-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h1>
        <p className="text-gray-600 mb-6">
          Your intake forms have been submitted successfully.
          {clinicInfo?.name && ` ${clinicInfo.name} will review your information before your appointment.`}
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 text-left text-sm text-gray-600 flex flex-col gap-3 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Your information is encrypted and sent securely to the clinic.</span>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Your data is deleted from our servers immediately after delivery.</span>
          </div>
        </div>

        <p className="text-xs text-gray-400">You can close this window.</p>
      </div>
    </div>
  )
}
