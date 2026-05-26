export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    outline: 'border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50',
    ghost: 'text-blue-600 hover:bg-blue-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-6 py-4 text-lg w-full',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
