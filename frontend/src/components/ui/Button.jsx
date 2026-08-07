function Button({ children, variant = 'primary', className = '', ...props }) {
  const variantStyles = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-400',
    secondary: 'border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800',
  }

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-3xl px-4 py-3 text-sm font-semibold transition ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
