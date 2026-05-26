export function Input({ label, error, className = '', required, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        required={required}
        className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className = '', required, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        required={required}
        className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}
          ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
