function FilterBar() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
          Last 7 days
        </button>
        <button type="button" className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
          All services
        </button>
        <button type="button" className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
          Severity: all
        </button>
      </div>
      <button type="button" className="inline-flex items-center justify-center rounded-3xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400">
        Export report
      </button>
    </div>
  )
}

export default FilterBar
