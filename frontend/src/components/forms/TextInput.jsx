function TextInput({ id, name, value, onChange, placeholder, className = '', ...props }) {
  return (
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400 ${className}`}
      {...props}
    />
  )
}

export default TextInput
