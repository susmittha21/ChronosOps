import { useNavigate } from 'react-router-dom'
import { BellIcon, SparklesIcon } from '../ui/Icons.jsx'

function Topbar() {
  const navigate = useNavigate()

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('chronosops_user') || '{}')
    } catch {
      return {}
    }
  })()

  const handleLogout = () => {
    localStorage.removeItem('chronosops_auth')
    localStorage.removeItem('chronosops_user')
    navigate('/login')
  }

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

        {/* User avatar + logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-900 px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
              {user.name ? user.name[0] : 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-white leading-none">{user.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{user.role || 'SRE Lead'}</p>
            </div>
          </div>
          <button
            id="topbar-logout"
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar
