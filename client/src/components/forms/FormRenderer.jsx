import { Input, Textarea } from '../ui/Input'
import { Checkbox } from '../ui/Checkbox'

export function FormRenderer({ form, data, onChange }) {
  const sections = form.sections || []

  return (
    <div className="flex flex-col gap-8">
      {sections.map((section, si) => (
        <div key={si}>
          {section.title && (
            <h3 className="text-base font-semibold text-blue-700 mb-4 pb-2 border-b border-blue-100">
              {section.title}
            </h3>
          )}

          {/* Static content block */}
          {section.content && (
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
              <RichText text={section.content} />
            </div>
          )}

          {/* Fields */}
          {section.fields && (
            <div className="flex flex-col gap-5">
              {section.fields.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  value={data?.[field.id]}
                  onChange={(val) => onChange(field.id, val)}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Top-level fields (outside sections) */}
      {form.fields && (
        <div className="flex flex-col gap-5">
          {form.fields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={data?.[field.id]}
              onChange={(val) => onChange(field.id, val)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FormField({ field, value, onChange }) {
  switch (field.type) {
    case 'text':
    case 'email':
      return (
        <Input
          label={field.label}
          type={field.type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      )

    case 'tel': {
      function formatPhone(raw) {
        const d = raw.replace(/\D/g, '').slice(0, 10)
        if (d.length > 6) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`
        if (d.length > 3) return `(${d.slice(0,3)}) ${d.slice(3)}`
        if (d.length > 0) return `(${d}`
        return ''
      }
      return (
        <Input
          label={field.label}
          type="tel"
          value={value || ''}
          onChange={(e) => onChange(formatPhone(e.target.value))}
          placeholder={field.placeholder || '(555) 000-0000'}
          required={field.required}
        />
      )
    }

    case 'date':
      return (
        <Input
          label={field.label}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      )

    case 'masked-date': {
      function formatDob(raw) {
        const digits = raw.replace(/\D/g, '').slice(0, 8)
        if (digits.length > 4) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
        if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
        return digits
      }
      return (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={value || ''}
            onChange={(e) => onChange(formatDob(e.target.value))}
            placeholder="MM/DD/YYYY"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg tracking-widest font-mono"
            required={field.required}
          />
        </div>
      )
    }

    case 'textarea':
      return (
        <Textarea
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
        />
      )

    case 'radio': {
      const enOpts = field.englishOptions || field.options || []
      return (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div className={`flex flex-wrap gap-2 ${field.options?.length > 6 ? 'flex-col' : ''}`}>
            {field.options?.map((opt, i) => {
              const storedVal = enOpts[i] ?? opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange(storedVal)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all
                    ${value === storedVal
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    case 'multicheck': {
      const enOpts = field.englishOptions || field.options || []
      return (
        <div className="flex flex-col gap-2">
          {field.label && (
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
          )}
          <div className="grid grid-cols-1 gap-2">
            {field.options?.map((opt, i) => {
              const storedVal = enOpts[i] ?? opt
              const checked = Array.isArray(value) ? value.includes(storedVal) : false
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                    ${checked
                      ? 'bg-blue-50 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-200'
                    }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                    checked={checked}
                    onChange={(e) => {
                      const current = Array.isArray(value) ? value : []
                      if (e.target.checked) {
                        onChange([...current, storedVal])
                      } else {
                        onChange(current.filter((v) => v !== storedVal))
                      }
                    }}
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              )
            })}
          </div>
        </div>
      )
    }

    case 'checkbox':
      return (
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 mt-0.5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </span>
        </label>
      )

    case 'pain-slider': {
      const level = value !== undefined && value !== '' ? parseInt(value) : null
      function btnColor(i) {
        if (level !== i) return 'bg-white border-gray-200 text-gray-600'
        if (i <= 3) return 'bg-green-500 border-green-500 text-white'
        if (i <= 6) return 'bg-yellow-500 border-yellow-500 text-white'
        return 'bg-red-500 border-red-500 text-white'
      }
      return (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div className="flex gap-1.5">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(String(i))}
                className={`flex-1 aspect-square rounded-xl border-2 text-sm font-bold transition-all ${btnColor(i)}`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1.5 px-0.5">
            <span>No pain</span>
            <span>Worst pain</span>
          </div>
        </div>
      )
    }

    default:
      return null
  }
}

function RichText({ text }) {
  if (!text) return null

  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
