function ChartPlaceholder({ title }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Chart</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
        </div>
        <span className="text-xs text-slate-400">Placeholder</span>
      </div>
      <div className="mt-6 h-56 rounded-3xl border border-dashed border-slate-700 bg-slate-950" />
    </div>
  )
}

export default ChartPlaceholder
