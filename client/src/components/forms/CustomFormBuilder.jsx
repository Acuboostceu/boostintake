import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'radio', label: 'Multiple Choice (pick one)' },
  { value: 'multicheck', label: 'Checkboxes (pick many)' },
  { value: 'checkbox', label: 'Single Checkbox' },
  { value: 'date', label: 'Date' },
]

export function CustomFormBuilder({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [requiresSignature, setRequiresSignature] = useState(initial?.requires_signature || false)
  const [signatureLabel, setSignatureLabel] = useState(initial?.signature_label || 'Signature')
  const [sections, setSections] = useState(
    initial?.sections?.length ? initial.sections : [{ title: '', fields: [] }]
  )
  const [saving, setSaving] = useState(false)

  function updateSection(si, key, val) {
    setSections((s) => s.map((sec, i) => i === si ? { ...sec, [key]: val } : sec))
  }

  function addSection() {
    setSections((s) => [...s, { title: '', fields: [] }])
  }

  function removeSection(si) {
    setSections((s) => s.filter((_, i) => i !== si))
  }

  function addField(si) {
    setSections((s) => s.map((sec, i) => i === si
      ? { ...sec, fields: [...sec.fields, { id: `field_${Date.now()}`, label: '', type: 'text', required: false, options: [] }] }
      : sec
    ))
  }

  function updateField(si, fi, key, val) {
    setSections((s) => s.map((sec, i) => i === si
      ? { ...sec, fields: sec.fields.map((f, j) => j === fi ? { ...f, [key]: val } : f) }
      : sec
    ))
  }

  function removeField(si, fi) {
    setSections((s) => s.map((sec, i) => i === si
      ? { ...sec, fields: sec.fields.filter((_, j) => j !== fi) }
      : sec
    ))
  }

  function moveField(si, fi, dir) {
    setSections((s) => s.map((sec, i) => {
      if (i !== si) return sec
      const fields = [...sec.fields]
      const to = fi + dir
      if (to < 0 || to >= fields.length) return sec;
      [fields[fi], fields[to]] = [fields[to], fields[fi]]
      return { ...sec, fields }
    }))
  }

  async function handleSave() {
    if (!title.trim()) return alert('Form title is required')
    setSaving(true)
    await onSave({ title: title.trim(), sections, requiresSignature, signatureLabel })
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Form title */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
        <h3 className="font-semibold text-gray-900">Form Settings</h3>
        <Input label="Form Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., New Patient Questionnaire" required />
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded text-blue-600" checked={requiresSignature} onChange={(e) => setRequiresSignature(e.target.checked)} />
          <span className="text-sm text-gray-700">Require patient signature on this form</span>
        </label>
        {requiresSignature && (
          <Input label="Signature Label" value={signatureLabel} onChange={(e) => setSignatureLabel(e.target.value)} placeholder="e.g., Patient Consent Signature" />
        )}
      </div>

      {/* Sections */}
      {sections.map((section, si) => (
        <div key={si} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
            <input
              className="flex-1 bg-transparent font-semibold text-gray-800 focus:outline-none placeholder-gray-400 text-sm"
              placeholder={`Section ${si + 1} title (optional)`}
              value={section.title}
              onChange={(e) => updateSection(si, 'title', e.target.value)}
            />
            {sections.length > 1 && (
              <button onClick={() => removeSection(si)} className="text-red-400 hover:text-red-600 text-sm">Remove section</button>
            )}
          </div>

          <div className="p-5 flex flex-col gap-4">
            {section.fields.map((field, fi) => (
              <FieldEditor
                key={field.id}
                field={field}
                onChange={(key, val) => updateField(si, fi, key, val)}
                onRemove={() => removeField(si, fi)}
                onMoveUp={() => moveField(si, fi, -1)}
                onMoveDown={() => moveField(si, fi, 1)}
                isFirst={fi === 0}
                isLast={fi === section.fields.length - 1}
              />
            ))}

            <button
              onClick={() => addField(si)}
              className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700 border-2 border-dashed border-blue-200 rounded-xl px-4 py-3 hover:border-blue-400 transition-colors"
            >
              <span className="text-lg leading-none">+</span> Add Field
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addSection}
        className="flex items-center justify-center gap-2 text-sm text-gray-500 font-medium border-2 border-dashed border-gray-200 rounded-2xl px-4 py-3 hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + Add Section
      </button>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" size="md" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button variant="primary" size="md" onClick={handleSave} disabled={saving || !title.trim()} className="flex-1">
          {saving ? 'Saving...' : 'Save Form'}
        </Button>
      </div>
    </div>
  )
}

function FieldEditor({ field, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const needsOptions = field.type === 'radio' || field.type === 'multicheck'

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3 bg-gray-50">
      <div className="flex items-center gap-2">
        {/* Move buttons */}
        <div className="flex flex-col gap-0.5">
          <button onClick={onMoveUp} disabled={isFirst} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 leading-none text-xs">▲</button>
          <button onClick={onMoveDown} disabled={isLast} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 leading-none text-xs">▼</button>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Field label / question"
              value={field.label}
              onChange={(e) => onChange('label', e.target.value)}
            />
            <select
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={field.type}
              onChange={(e) => onChange('type', e.target.value)}
            >
              {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {field.type === 'text' && (
            <input
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Placeholder text (optional)"
              value={field.placeholder || ''}
              onChange={(e) => onChange('placeholder', e.target.value)}
            />
          )}

          {needsOptions && (
            <OptionsEditor
              options={field.options || []}
              onChange={(opts) => onChange('options', opts)}
            />
          )}

          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 rounded text-blue-600" checked={!!field.required} onChange={(e) => onChange('required', e.target.checked)} />
            Required field
          </label>
        </div>

        <button onClick={onRemove} className="text-red-400 hover:text-red-600 text-lg leading-none flex-shrink-0">×</button>
      </div>
    </div>
  )
}

function OptionsEditor({ options, onChange }) {
  function update(i, val) {
    const next = [...options]; next[i] = val; onChange(next)
  }
  function add() { onChange([...options, '']) }
  function remove(i) { onChange(options.filter((_, j) => j !== i)) }

  return (
    <div className="flex flex-col gap-1.5">
      {options.map((opt, i) => (
        <div key={i} className="flex gap-1.5">
          <input
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => update(i, e.target.value)}
          />
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-sm px-1">×</button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-blue-600 hover:underline self-start">+ Add option</button>
    </div>
  )
}
