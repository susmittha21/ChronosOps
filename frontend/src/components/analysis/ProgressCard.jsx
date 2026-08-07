function ProgressCard({ title, subtitle, progress }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
        <span className="text-sm font-semibold text-indigo-400">{progress}%</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default ProgressCard
