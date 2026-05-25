export function Checkbox({ label, description, error, className = '', ...props }) {
  return (
    <label className={`flex gap-3 cursor-pointer group ${className}`}>
      <div className="flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
          {...props}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">{label}</span>
        {description && <span className="text-xs text-gray-500 mt-0.5">{description}</span>}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </label>
  )
}

export function RadioGroup({ label, options, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span className="text-sm text-gray-800">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
