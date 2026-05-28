import { FORM_CATALOG, CATEGORY_ORDER, CATEGORY_COLORS, CATEGORY_META } from '../../forms/catalog'

export const DEFAULT_FORM_IDS = ['patient_info', 'hipaa', 'financial_policy', 'assignment_of_benefits', 'arbitration']

/**
 * FormSelector — staff-facing component to choose which forms a patient needs.
 *
 * Props:
 *   availableForms   — array of catalog entries the clinic has enabled
 *   selectedIds      — array of currently selected form IDs
 *   onChange(newIds) — callback when selection changes
 */
export function FormSelector({ availableForms, selectedIds, onChange }) {
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const forms = (availableForms || FORM_CATALOG).filter((f) => f.category === cat && !f.comingSoon)
    if (forms.length > 0) acc[cat] = forms
    return acc
  }, {})

  function toggle(id) {
    const isSelected = selectedIds.includes(id)
    onChange(isSelected ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([cat, forms]) => {
        const meta = CATEGORY_META[cat] || { label: cat }
        return (
          <div key={cat}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
              {meta.label}
            </p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {forms.map((form) => {
                const isSelected = selectedIds.includes(form.id)

                return (
                  <label
                    key={form.id}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggle(form.id)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900">{form.title}</span>
                        {form.requiresSignature && (
                          <span className="text-xs text-gray-400">Requires signature</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{form.description}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
