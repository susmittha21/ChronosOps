import { BellIcon, SparklesIcon } from '../ui/Icons.jsx'

function Topbar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-4 py-4 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Command Center</p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Infrastructure operations dashboard</h1>
      </div>

      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-300 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Status</p>
          <p className="mt-1 text-sm text-white">7 Healthy · 1 Warning · 1 Critical</p>
        </div>

        <div className="flex items-center gap-3 rounded-3xl bg-slate-900 px-4 py-3 text-slate-300 shadow-sm">
          <SparklesIcon className="h-5 w-5 text-cyan-400" />
          <span className="text-sm text-slate-300">Latest update: 10:28 AM</span>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-3xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          <BellIcon className="h-5 w-5" />
          Notifications
        </button>
      </div>
    </header>
  )
}

export default Topbar
