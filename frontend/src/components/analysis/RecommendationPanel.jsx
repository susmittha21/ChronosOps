import Button from '../ui/Button.jsx'

function RecommendationPanel({ title, items }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recommendation</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
        </div>
        <Button variant="secondary">Simulate</Button>
      </div>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecommendationPanel
