import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFormStore } from '../../store/formStore'
import { getAcupunctureForms } from '../../forms/acupuncture'
import { getChiropracticForms } from '../../forms/chiropractic'
import { FormRenderer } from '../../components/forms/FormRenderer'
import { SignaturePad } from '../../components/forms/SignaturePad'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { Button } from '../../components/ui/Button'
import { API } from '../../lib/api'
import { useTranslations } from '../../i18n/translations'

export function PatientForms({ isTablet = false, onTabletComplete }) {
  const params = useParams()
  const token = isTablet ? 'tablet' : params.token
  const navigate = useNavigate()
  const {
    patient, clinicInfo, lang,
    currentFormIndex, formData, signatures, declinedForms,
    setFormData, setSignature, setDeclined, nextForm, prevForm,
  } = useFormStore()
  const tr = useTranslations(lang)

  const getFormsFn = clinicInfo?.specialty === 'chiropractic' ? getChiropracticForms : getAcupunctureForms
  const forms = getFormsFn(clinicInfo || {}, lang)       // patient sees (translated)
  const formsEn = getFormsFn(clinicInfo || {}, 'en')    // PDF always English
  const form = forms[currentFormIndex]
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Redirect if no patient identity (only for non-tablet flows)
  useEffect(() => {
    if (!patient && !isTablet) navigate(`/p/${token}`, { replace: true })
  }, [patient])

  if (!patient || !form) return null

  const isLastForm = currentFormIndex === forms.length - 1
  const currentSig = signatures[form.id]
  const isDeclined = declinedForms[form.id]

  function handleFieldChange(fieldId, value) {
    setFormData(form.id, { [fieldId]: value })
  }

  function validateCurrentForm() {
    if (!form.sections && !form.fields) return true

    const allFields = [
      ...(form.sections?.flatMap((s) => s.fields || []) || []),
      ...(form.fields || []),
    ]

    for (const field of allFields) {
      if (field.required && !formData[form.id]?.[field.id]) {
        return `${tr.forms.fieldRequired}"${field.label}"`
      }
    }

    if (form.requiresSignature && !currentSig && !isDeclined) {
      return tr.forms.signatureRequired
    }

    return null
  }

  function handleNext() {
    const err = validateCurrentForm()
    if (err) { setValidationError(err); return }
    setValidationError('')

    if (isLastForm) {
      handleSubmit()
    } else {
      nextForm()
      window.scrollTo({ top: 0 })
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const clinicId = isTablet
        ? JSON.parse(localStorage.getItem('bi_clinic') || '{}').clinicId
        : undefined

      // Collect form content texts for PDF generation — always English
      const formContents = {}
      const formFields = {}
      formsEn.forEach((form) => {
        if (form.content) {
          formContents[form.id] = form.content
        } else if (form.getText) {
          formContents[form.id] = form.getText(clinicInfo || {})
        } else if (form.sections) {
          const text = form.sections
            .filter((s) => s.content)
            .map((s) => (s.title ? `${s.title}\n\n${s.content}` : s.content))
            .join('\n\n')
          if (text) formContents[form.id] = text
        }
        // Collect field definitions (label + id) for blank-line rendering — English labels
        const fields = [
          ...(form.sections?.flatMap((s) => s.fields || []) || []),
          ...(form.fields || []),
        ]
        if (fields.length > 0) {
          formFields[form.id] = fields.map((f) => ({ id: f.id, label: f.label, type: f.type }))
        }
      })

      const res = await fetch(`${API}/api/patient/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          patient,
          formData,
          signatures,
          declinedForms,
          clinicId,
          formContents,
          formFields,
        }),
      })
      if (!res.ok) throw new Error('Submit failed')
      if (isTablet && onTabletComplete) {
        onTabletComplete()
      } else {
        navigate(`/p/${token}/complete`)
      }
    } catch (e) {
      setValidationError(tr.forms.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  const formText = typeof form.content === 'string'
    ? form.content
    : form.getText
    ? form.getText(clinicInfo || {})
    : null

  return (
    <div className="min-h-dvh bg-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <ProgressBar
            current={currentFormIndex + 1}
            total={forms.length}
            label={form.title}
          />
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto flex flex-col gap-6">
          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{form.title}</h2>
              {form.optional && (
                <span className="inline-block mt-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {tr.forms.optional}
                </span>
              )}
            </div>

            <div className="px-6 py-5">
              {/* Static content */}
              {formText && (
                <div className="prose prose-sm text-gray-700 mb-6 whitespace-pre-line leading-relaxed text-sm">
                  <FormattedContent text={formText} />
                </div>
              )}

              {/* Form intro */}
              {form.intro && (
                <p className="text-sm text-gray-600 bg-blue-50 rounded-xl px-4 py-3 mb-6">
                  {form.intro}
                </p>
              )}

              {/* Dynamic form fields */}
              <FormRenderer
                form={form}
                data={formData[form.id]}
                onChange={handleFieldChange}
              />

              {/* Signature section */}
              {form.requiresSignature && !isDeclined && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <SignaturePad
                    key={form.id}
                    label={form.signatureLabel || 'Signature'}
                    onSave={(dataUrl) => setSignature(form.id, dataUrl)}
                    onDecline={() => setDeclined(form.id, true)}
                    canDecline={form.optional || false}
                    existingDataUrl={currentSig}
                  />
                </div>
              )}

              {/* Declined state */}
              {isDeclined && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600 italic">{tr.forms.declined}</span>
                    <button
                      type="button"
                      className="text-sm text-blue-600 font-medium hover:underline"
                      onClick={() => setDeclined(form.id, false)}
                    >
                      {tr.forms.undo}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation error */}
          {validationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {validationError}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pb-8">
            {currentFormIndex > 0 && (
              <Button
                variant="outline"
                size="md"
                onClick={() => { setValidationError(''); prevForm(); window.scrollTo({ top: 0 }) }}
                className="flex-1"
              >
                {tr.forms.back}
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              disabled={submitting}
              className="flex-1"
            >
              {submitting
                ? tr.forms.submitting
                : isLastForm
                ? tr.forms.submit
                : currentFormIndex === forms.length - 2
                ? tr.forms.finish
                : tr.forms.next}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function FormattedContent({ text }) {
  const lines = text.trim().split('\n')
  return (
    <div className="flex flex-col gap-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />
        // Bold headers
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold text-gray-900">{line.slice(2, -2)}</p>
        }
        // Bullet points
        if (line.startsWith('•')) {
          return <p key={i} className="flex gap-2"><span className="text-blue-500 flex-shrink-0">•</span><span>{parseBold(line.slice(1).trim())}</span></p>
        }
        return <p key={i}>{parseBold(line)}</p>
      })}
    </div>
  )
}

function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  )
}
