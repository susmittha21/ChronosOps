import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { getIncidents } from '../services/incidentService.js'

const severityStyles = {
  CRITICAL: 'bg-rose-600/15 text-rose-300 border border-rose-500/30',
  HIGH: 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
  MEDIUM: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  LOW: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
}

const statusStyles = {
  OPEN: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
  INVESTIGATING: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
  RESOLVED_NOT_SAVED: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  RESOLVED_SAVED: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Incidents() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedDate, setSelectedDate] = useState('all')

  const loadIncidents = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getIncidents({
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        service: selectedService !== 'all' ? selectedService : undefined,
      })
      setIncidents(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Unable to load incidents.')
      setIncidents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIncidents()
  }, [selectedStatus, selectedService])

  const serviceOptions = useMemo(() => {
    const values = new Set(incidents.map((incident) => incident.service).filter(Boolean))
    return Array.from(values).sort()
  }, [incidents])

  const filteredIncidents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return incidents.filter((incident) => {
      const matchesSearch =
        !term ||
        [incident.title, incident.service, incident.description, incident.error_message, incident.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term))

      const matchesSeverity = selectedSeverity === 'all' || incident.severity === selectedSeverity
      const matchesDate = (() => {
        if (selectedDate === 'all') return true
        if (!incident.created_at) return false

        const incidentDate = new Date(incident.created_at)
        const now = new Date()
        const diffDays = (now - incidentDate) / (1000 * 60 * 60 * 24)

        if (selectedDate === '7') return diffDays <= 7
        if (selectedDate === '30') return diffDays <= 30
        if (selectedDate === '90') return diffDays <= 90
        return true
      })()

      return matchesSearch && matchesSeverity && matchesDate
    })
  }, [incidents, searchTerm, selectedSeverity, selectedDate])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedStatus('all')
    setSelectedService('all')
    setSelectedSeverity('all')
    setSelectedDate('all')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 lg:min-w-0">
          <Topbar />
          <main className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Incident history</p>
                <h1 className="mt-2 text-2xl font-semibold text-white">Incidents</h1>
              </div>
              <p className="text-sm text-slate-400">View, search and investigate infrastructure incidents.</p>
            </header>

            <Card className="p-5">
              <div className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.8fr_auto]">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Search</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search incidents..."
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Service</span>
                  <select
                    value={selectedService}
                    onChange={(event) => setSelectedService(event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                  >
                    <option value="all">All services</option>
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Severity</span>
                  <select
                    value={selectedSeverity}
                    onChange={(event) => setSelectedSeverity(event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                  >
                    <option value="all">All severities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Status</span>
                  <select
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                  >
                    <option value="all">All statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="INVESTIGATING">Investigating</option>
                    <option value="RESOLVED_NOT_SAVED">Resolved not saved</option>
                    <option value="RESOLVED_SAVED">Resolved saved</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-slate-500">Date</span>
                  <select
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                  >
                    <option value="all">Any time</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </label>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </Card>

            <Card title="Incident list" className="overflow-hidden p-0">
              {loading ? (
                <div className="p-6 text-sm text-slate-400">Loading incidents...</div>
              ) : error ? (
                <div className="space-y-4 p-6">
                  <p className="text-sm text-rose-300">Unable to load incidents.</p>
                  <Button variant="primary" onClick={loadIncidents}>Retry</Button>
                </div>
              ) : filteredIncidents.length === 0 ? (
                <div className="p-6 text-sm text-slate-400">
                  No incidents found.
                  <div className="mt-2">Try changing your search or filters.</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                    <thead className="border-b border-slate-800 bg-slate-950 text-xs uppercase tracking-[0.24em] text-slate-500">
                      <tr>
                        <th scope="col" className="px-4 py-3">Incident</th>
                        <th scope="col" className="px-4 py-3">Service</th>
                        <th scope="col" className="px-4 py-3">Severity</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredIncidents.map((incident) => (
                        <tr
                          key={incident.id}
                          onClick={() => navigate(`/incidents/${incident.id}`)}
                          className="cursor-pointer transition hover:bg-slate-950/60"
                        >
                          <td className="px-4 py-4">
                            <div className="font-medium text-white">#{incident.id} — {incident.title}</div>
                          </td>
                          <td className="px-4 py-4">{incident.service}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${severityStyles[incident.severity] || 'bg-slate-700 text-slate-200'}`}>
                              {incident.severity}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[incident.status] || 'bg-slate-700 text-slate-200'}`}>
                              {incident.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">{formatDate(incident.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Incidents
