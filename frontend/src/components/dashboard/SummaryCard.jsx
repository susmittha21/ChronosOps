import Card from '../ui/Card.jsx'

function SummaryCard({ label, value, status, className = '' }) {
  const statusClasses = {
    healthy: 'bg-emerald-500 text-white',
    warning: 'bg-amber-500 text-slate-950',
    critical: 'bg-rose-500 text-white',
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses[status] || 'bg-slate-700 text-slate-100'}`}>
          {status}
        </span>
      </div>
    </Card>
  )
}

export default SummaryCard
