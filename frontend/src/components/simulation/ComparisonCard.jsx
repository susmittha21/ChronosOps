function ComparisonCard({ title, items }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
      <p className="text-sm font-semibold text-white">{title}</p>
      <ul className="mt-4 space-y-3 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ComparisonCard
