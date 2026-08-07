function SelectInput({ id, name, value, onChange, options, className = '', ...props }) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400 ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default SelectInput
