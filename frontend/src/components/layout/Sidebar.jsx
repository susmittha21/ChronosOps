import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Command Center', path: '/', icon: '⌘' },
  { label: 'Incidents', path: '/incidents', icon: '⚠️' },
  { label: 'New Incident', path: '/new', icon: '✚' },
  { label: 'Knowledge Memory', path: '/knowledge', icon: '🧠' },
  { label: 'Analytics', path: '/analytics', icon: '📈' },
  { label: 'Runbooks', path: '/runbooks', icon: '📚' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
]

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col gap-4 border-r border-slate-800 bg-slate-950 px-4 py-6 text-slate-200 lg:flex">
      <div className="mb-10 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-semibold text-white">C</span>
        <div>
          <p className="text-sm font-semibold text-white">ChronosOps</p>
          <p className="text-xs text-slate-400">Operational memory for infra</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-slate-800 ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">Engineer</p>
        <p className="text-xs text-slate-500">Infrastructure Team</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Online
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
