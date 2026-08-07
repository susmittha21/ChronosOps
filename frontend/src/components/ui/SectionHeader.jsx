function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{subtitle}</p>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
  )
}

export default SectionHeader
