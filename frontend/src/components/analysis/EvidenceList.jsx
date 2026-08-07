function EvidenceList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">
          {item}
        </li>
      ))}
    </ul>
  )
}

export default EvidenceList
