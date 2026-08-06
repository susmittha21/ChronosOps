function HealthRow({ service, status, responseTime }) {
  const statusStyles = {
    Healthy: 'bg-emerald-500/15 text-emerald-300',
    Warning: 'bg-amber-500/15 text-amber-300',
    Critical: 'bg-rose-500/15 text-rose-300',
  }

  return (
    <li className="flex items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4">
      <div>
        <p className="text-sm font-medium text-white">{service}</p>
        <p className="text-xs text-slate-500">Response time</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || 'bg-slate-700 text-slate-200'}`}>
          {status}
        </span>
        <span className="text-sm font-semibold text-white">{responseTime}</span>
      </div>
    </li>
  )
}

export default HealthRow
