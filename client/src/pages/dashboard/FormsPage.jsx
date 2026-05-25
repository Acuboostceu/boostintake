import { useState, useEffect, useRef } from 'react'
import { FORM_CATALOG, CATEGORY_COLORS, CATEGORY_ORDER, CATEGORY_META, DEFAULT_FORM_IDS } from '../../forms/catalog'
import { FormPreviewModal } from '../../components/forms/FormPreviewModal'
import { CustomFormBuilder } from '../../components/forms/CustomFormBuilder'
import { Button } from '../../components/ui/Button'

const AUTH = () => ({ Authorization: `Bearer ${localStorage.getItem('bi_token')}` })

export function FormsPage() {
  const [enabledIds, setEnabledIds] = useState(DEFAULT_FORM_IDS)
  const [customForms, setCustomForms] = useState([])
  const [previewForm, setPreviewForm] = useState(null)
  const [view, setView] = useState('list')
  const [editingCustom, setEditingCustom] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saving' | 'saved'
  const [loading, setLoading] = useState(true)
  const [openCategories, setOpenCategories] = useState({ acupuncture: false, chiropractic: false, massage: false })
  const saveTimer = useRef(null)

  useEffect(() => {
    fetch('/api/forms', { headers: AUTH() })
      .then((r) => r.json())
      .then(({ enabled, custom }) => {
        if (enabled.length > 0) setEnabledIds(enabled.map((f) => f.form_id))
        setCustomForms(custom)
      })
      .finally(() => setLoading(false))
  }, [])

  function autoSave(newIds) {
    setSaveStatus('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const res = await fetch('/api/forms/selection', {
        method: 'POST',
        headers: { ...AUTH(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ formIds: newIds }),
      })
      setSaveStatus(res.ok ? 'saved' : 'idle')
      if (res.ok) setTimeout(() => setSaveStatus('idle'), 2000)
    }, 600)
  }

  function toggleForm(id) {
    const catalog = FORM_CATALOG.find((f) => f.id === id)
    if (catalog?.required || catalog?.comingSoon) return
    setEnabledIds((ids) => {
      const next = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
      autoSave(next)
      return next
    })
  }

  function toggleCategory(cat) {
    setOpenCategories((s) => ({ ...s, [cat]: !s[cat] }))
  }

  async function handleCreateCustom(data) {
    const res = await fetch('/api/forms/custom', {
      method: 'POST',
      headers: { ...AUTH(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const created = await res.json()
    setCustomForms((f) => [...f, created])
    const newIds = [...enabledIds, created.id]
    setEnabledIds(newIds)
    autoSave(newIds)
    setView('list')
  }

  async function handleUpdateCustom(data) {
    const res = await fetch(`/api/forms/custom/${editingCustom.id}`, {
      method: 'PUT',
      headers: { ...AUTH(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setCustomForms((f) => f.map((c) => c.id === editingCustom.id ? { ...c, ...data, title: data.title } : c))
      setView('list')
      setEditingCustom(null)
    }
  }

  async function handleDeleteCustom(id) {
    if (!confirm('Delete this custom form?')) return
    await fetch(`/api/forms/custom/${id}`, { method: 'DELETE', headers: AUTH() })
    setCustomForms((f) => f.filter((c) => c.id !== id))
    const newIds = enabledIds.filter((i) => i !== id)
    setEnabledIds(newIds)
    autoSave(newIds)
  }

  if (view === 'builder') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="text-teal-600 hover:underline text-sm">← Back to Forms</button>
          <h1 className="text-xl font-bold text-gray-900">Create Custom Form</h1>
        </div>
        <CustomFormBuilder onSave={handleCreateCustom} onCancel={() => setView('list')} />
      </div>
    )
  }

  if (view === 'edit' && editingCustom) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setView('list'); setEditingCustom(null) }} className="text-teal-600 hover:underline text-sm">← Back to Forms</button>
          <h1 className="text-xl font-bold text-gray-900">Edit: {editingCustom.title}</h1>
        </div>
        <CustomFormBuilder initial={editingCustom} onSave={handleUpdateCustom} onCancel={() => { setView('list'); setEditingCustom(null) }} />
      </div>
    )
  }

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    meta: CATEGORY_META[cat],
    forms: FORM_CATALOG.filter((f) => f.category === cat),
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-500 mt-1 text-sm">Select which forms patients will fill out</p>
        </div>
        <div className="text-sm font-medium">
          {saveStatus === 'saving' && <span className="text-gray-400">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-teal-600">✓ Saved</span>}
        </div>
      </div>

      {/* Active count */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-teal-800">
          <strong>{enabledIds.length} forms</strong> will be sent to patients
        </p>
        <span className="text-xs text-teal-600">
          {enabledIds.filter((id) => {
            const b = FORM_CATALOG.find((f) => f.id === id)
            const c = customForms.find((f) => f.id === id)
            return b?.requiresSignature || c?.requires_signature
          }).length} require signature
        </span>
      </div>

      {/* Common forms (always visible) */}
      {grouped.filter(({ cat }) => cat === 'common').map(({ cat, meta, forms }) => (
        <div key={cat} className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{meta.label}</span>
          <div className="flex flex-col gap-2">
            {forms.map((form) => (
              <FormRow
                key={form.id}
                title={form.title}
                description={form.description}
                enabled={enabledIds.includes(form.id)}
                required={form.required}
                requiresSignature={form.requiresSignature}
                optional={form.optional}
                onToggle={() => toggleForm(form.id)}
                onPreview={() => setPreviewForm({ formId: form.id })}
                showPreview
              />
            ))}
          </div>
        </div>
      ))}

      {/* Custom forms — right after common */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Custom Forms</span>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">Your forms</span>
          </div>
          <button onClick={() => setView('builder')} className="text-sm text-teal-600 font-medium hover:underline">
            + Create new
          </button>
        </div>

        {customForms.length === 0 ? (
          <button
            onClick={() => setView('builder')}
            className="w-full border-2 border-dashed border-purple-200 rounded-2xl py-6 text-center hover:border-purple-400 transition-colors group bg-purple-50/40"
          >
            <p className="text-purple-400 group-hover:text-purple-600 font-medium text-sm">+ Create a custom form</p>
            <p className="text-purple-300 text-xs mt-1">Add your own questions, sections, and fields</p>
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            {customForms.map((cf) => (
              <FormRow
                key={cf.id}
                title={cf.title}
                description={`${cf.sections?.length || 0} section(s) · ${cf.sections?.reduce((a, s) => a + (s.fields?.length || 0), 0) || 0} fields`}
                enabled={enabledIds.includes(cf.id)}
                required={false}
                requiresSignature={cf.requires_signature}
                showPreview
                isCustom
                onToggle={() => {
                  setEnabledIds((ids) => {
                    const next = ids.includes(cf.id) ? ids.filter((i) => i !== cf.id) : [...ids, cf.id]
                    autoSave(next)
                    return next
                  })
                }}
                onPreview={() => setPreviewForm({ customForm: cf })}
                onEdit={() => { setEditingCustom(cf); setView('edit') }}
                onDelete={() => handleDeleteCustom(cf.id)}
              />
            ))}
            <button onClick={() => setView('builder')} className="text-sm text-teal-600 font-medium hover:underline px-1 py-2 self-start">
              + Create another
            </button>
          </div>
        )}
      </div>

      {/* Specialty templates (collapsible) */}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Specialty Templates</span>
        {grouped.filter(({ cat }) => cat !== 'common').map(({ cat, meta, forms }) => {
          const isOpen = openCategories[cat]
          return (
            <div key={cat} className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
              <button
                className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleCategory(cat)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">{meta.label}</span>
                  {meta.comingSoon && (
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Coming Soon</span>
                  )}
                  {!meta.comingSoon && (
                    <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full">
                      {enabledIds.filter((id) => forms.some((f) => f.id === id)).length}/{forms.length} active
                    </span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
                  {forms.map((form) => (
                    <FormRow
                      key={form.id}
                      title={form.title}
                      description={form.description}
                      enabled={enabledIds.includes(form.id)}
                      required={form.required}
                      requiresSignature={form.requiresSignature}
                      optional={form.optional}
                      comingSoon={form.comingSoon}
                      onToggle={() => toggleForm(form.id)}
                      onPreview={() => !form.comingSoon && setPreviewForm({ formId: form.id })}
                      showPreview={!form.comingSoon}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {previewForm && (
        <FormPreviewModal
          formId={previewForm.formId}
          customForm={previewForm.customForm}
          onClose={() => setPreviewForm(null)}
        />
      )}
    </div>
  )
}

function FormRow({ title, description, enabled, required, requiresSignature, optional, comingSoon, isCustom, onToggle, onPreview, showPreview, onEdit, onDelete }) {
  return (
    <div className={`rounded-xl border shadow-sm px-4 py-3 flex items-center gap-3 transition-all
      ${comingSoon ? 'opacity-60 border-gray-100 bg-white' : enabled ? (isCustom ? 'border-purple-200 bg-purple-50/30' : 'border-teal-200 bg-white') : 'border-gray-100 bg-white'}`}>
      <button
        onClick={onToggle}
        disabled={required || comingSoon}
        className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all
          ${required || comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${enabled && !comingSoon ? 'bg-teal-500 border-teal-500' : 'border-gray-300 hover:border-teal-400'}`}
      >
        {enabled && !comingSoon && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-900">{title}</span>
          {required && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Required</span>}
          {optional && <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded">Optional</span>}
          {requiresSignature && !comingSoon && <span className="text-xs text-teal-600">✍️ Signature</span>}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {showPreview && !comingSoon && (
          <button onClick={onPreview} className="text-xs text-gray-400 hover:text-teal-600 px-2 py-1 rounded-lg hover:bg-teal-50 transition-colors">
            Preview
          </button>
        )}
        {onEdit && (
          <button onClick={onEdit} className="text-xs text-gray-400 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
