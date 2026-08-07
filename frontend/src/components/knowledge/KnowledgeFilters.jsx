function KnowledgeFilters() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <label className="flex-1">
        <span className="sr-only">Search knowledge base</span>
        <input
          type="search"
          placeholder="Search incidents or services"
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
          All severities
        </button>
        <button type="button" className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
          Last 30 days
        </button>
      </div>
    </div>
  )
}

export default KnowledgeFilters
