function StatCard({ title, value, delta, icon, className = '' }) {
  return (
    <div className={`rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        {icon ? <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-500 text-white">{icon}</div> : null}
      </div>
      {delta ? (
        <p className="mt-4 text-sm text-slate-400">{delta}</p>
      ) : null}
    </div>
  )
}

export default StatCard
