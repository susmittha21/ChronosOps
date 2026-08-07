function FormField({ label, id, children, error }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-200">
        {label}
      </label>
      {children}
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  )
}

export default FormField
