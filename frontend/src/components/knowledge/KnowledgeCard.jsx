function KnowledgeCard({ title, service, summary, confidence, date, active = false }) {
  return (
    <article className={`rounded-3xl border p-5 shadow-sm transition ${active ? 'border-indigo-500 bg-slate-900' : 'border-slate-800 bg-slate-950'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-2 text-sm text-slate-400">{service}</p>
        </div>
        <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300">
          {confidence}%
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-400">{summary}</p>
      <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
        <span>{date}</span>
        <span>Knowledge</span>
      </div>
    </article>
  )
}

export default KnowledgeCard
