import { useEffect } from 'react'
import { PATIENT_INFO_FORM } from '../../forms/common/patientInfo'
import { HIPAA_FORM } from '../../forms/common/hipaa'
import { FINANCIAL_POLICY_FORM } from '../../forms/common/financialPolicy'
import { ASSIGNMENT_OF_BENEFITS_FORM } from '../../forms/common/assignmentOfBenefits'
import { ARBITRATION_FORM } from '../../forms/common/arbitration'
import { ACUPUNCTURE_CONSENT_FORM } from '../../forms/acupuncture/acupunctureConsent'
import { HEALTH_HISTORY_FORM } from '../../forms/acupuncture/healthHistory'
import { REVIEW_OF_SYSTEMS_FORM } from '../../forms/acupuncture/reviewOfSystems'

const BUILT_IN_FORMS = {
  patient_info: PATIENT_INFO_FORM,
  hipaa: HIPAA_FORM,
  financial_policy: FINANCIAL_POLICY_FORM,
  assignment_of_benefits: ASSIGNMENT_OF_BENEFITS_FORM,
  arbitration: ARBITRATION_FORM,
  acupuncture_consent: ACUPUNCTURE_CONSENT_FORM,
  health_history: HEALTH_HISTORY_FORM,
  review_of_systems: REVIEW_OF_SYSTEMS_FORM,
}

export function FormPreviewModal({ formId, customForm, onClose }) {
  const form = customForm || BUILT_IN_FORMS[formId]

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  if (!form) return null

  const sections = form.sections || []
  const content = typeof form.content === 'string' ? form.content
    : form.getText ? form.getText({ clinicName: 'Your Clinic', cancelHours: 24, noShowFee: 50, checkFee: 35 })
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">{form.title}</h2>
            {form.requiresSignature && (
              <span className="text-xs text-blue-600 font-medium">✍️ Requires signature</span>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">✕</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Static content */}
          {content && (
            <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 whitespace-pre-line">
              {content.trim()}
            </div>
          )}

          {/* Sections */}
          {sections.map((section, si) => (
            <div key={si}>
              {section.title && (
                <h3 className="text-sm font-semibold text-blue-700 mb-3 pb-1.5 border-b border-blue-100">
                  {section.title}
                </h3>
              )}
              {section.content && (
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{section.content}</p>
              )}
              {section.fields && (
                <div className="flex flex-col gap-3">
                  {section.fields.map((field) => (
                    <FieldPreview key={field.id} field={field} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Top-level fields */}
          {form.fields && (
            <div className="flex flex-col gap-3">
              {form.fields.map((field) => (
                <FieldPreview key={field.id} field={field} />
              ))}
            </div>
          )}

          {/* Signature placeholder */}
          {form.requiresSignature && (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{form.signatureLabel || 'Signature'}</p>
              <div className="h-12 flex items-center justify-center">
                <span className="text-gray-300 text-sm italic">Patient signature goes here</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FieldPreview({ field }) {
  const label = <p className="text-xs font-medium text-gray-500 mb-1">{field.label}{field.required && <span className="text-red-400 ml-1">*</span>}</p>

  switch (field.type) {
    case 'text':
    case 'tel':
    case 'email':
    case 'date':
      return (
        <div>
          {label}
          <div className="h-9 rounded-lg border border-gray-200 bg-gray-50" />
        </div>
      )
    case 'textarea':
      return (
        <div>
          {label}
          <div className="h-16 rounded-lg border border-gray-200 bg-gray-50" />
        </div>
      )
    case 'radio':
      return (
        <div>
          {label}
          <div className="flex flex-wrap gap-2">
            {(field.options || []).map((opt) => (
              <span key={opt} className="px-3 py-1 text-xs rounded-lg border border-gray-200 bg-white text-gray-600">{opt}</span>
            ))}
          </div>
        </div>
      )
    case 'multicheck':
      return (
        <div>
          {label}
          <div className="grid grid-cols-2 gap-1">
            {(field.options || []).slice(0, 6).map((opt) => (
              <div key={opt} className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3.5 h-3.5 rounded border border-gray-300 flex-shrink-0" />
                {opt}
              </div>
            ))}
            {field.options?.length > 6 && (
              <p className="text-xs text-gray-400">+{field.options.length - 6} more...</p>
            )}
          </div>
        </div>
      )
    case 'checkbox':
      return (
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 rounded border border-gray-300 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700">{field.label}</p>
        </div>
      )
    default:
      return null
  }
}
