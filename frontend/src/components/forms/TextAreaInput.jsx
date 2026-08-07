function TextAreaInput({ id, name, value, onChange, placeholder, rows = 4, className = '', ...props }) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400 ${className}`}
      {...props}
    />
  )
}

export default TextAreaInput
