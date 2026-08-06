function Card({ title, children, className = '' }) {
  return (
    <section className={`rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm ${className}`}>
      {title ? <h2 className="text-lg font-semibold text-white">{title}</h2> : null}
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default Card
