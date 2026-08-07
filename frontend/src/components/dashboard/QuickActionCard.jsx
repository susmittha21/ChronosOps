import Button from '../ui/Button.jsx'

function QuickActionCard() {
  const actions = [
    { label: 'Analyse New Incident', variant: 'primary' },
    { label: 'View Knowledge Memory', variant: 'secondary' },
  ]

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quick actions</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Jump into response flow</h3>
        </div>
        <span className="text-xs text-slate-400">Fast access</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Button key={action.label} variant={action.variant} className="w-full justify-center">
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default QuickActionCard
