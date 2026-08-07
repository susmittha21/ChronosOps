function InfoList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
          <p className="mt-2 text-sm text-slate-200">{item.value}</p>
        </li>
      ))}
    </ul>
  )
}

export default InfoList
