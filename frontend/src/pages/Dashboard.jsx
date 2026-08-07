import { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import SummaryCard from '../components/dashboard/SummaryCard.jsx'
import HealthRow from '../components/dashboard/HealthRow.jsx'
import IncidentTable from '../components/dashboard/IncidentTable.jsx'
import ChartPlaceholder from '../components/dashboard/ChartPlaceholder.jsx'
import QuickActionCard from '../components/dashboard/QuickActionCard.jsx'
import NotificationsPanel from '../components/dashboard/NotificationsPanel.jsx'
import { getDashboardData, getIncidents } from '../services/incidentService.js'

const healthData = [
  { service: 'Payment API', status: 'Healthy', responseTime: '120 ms' },
  { service: 'Authentication', status: 'Healthy', responseTime: '170 ms' },
  { service: 'PostgreSQL', status: 'Healthy', responseTime: '89 ms' },
  { service: 'Redis Cache', status: 'Healthy', responseTime: '38 ms' },
]

function Dashboard() {
  const [dashboardMetrics, setDashboardMetrics] = useState({
    total_incidents: 0,
    active_incidents: 0,
    resolved_incidents: 0,
    pending_memory_review: 0,
    knowledge_records: 0,
    average_mttr_minutes: 0,
  })
  const [incidentsList, setIncidentsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [dashData, incData] = await Promise.all([
          getDashboardData(),
          getIncidents(),
        ])
        if (dashData) setDashboardMetrics(dashData)
        if (Array.isArray(incData)) {
          const formatted = incData.map((inc) => ({
            id: inc.id,
            title: inc.title,
            service: inc.service,
            severity: inc.severity,
            status: inc.status,
            date: inc.created_at ? new Date(inc.created_at).toLocaleDateString() : 'Today',
          }))
          setIncidentsList(formatted)
        }
      } catch (err) {
        console.error('Failed to load dashboard data from backend:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 lg:min-w-0">
          <Topbar />
          <main className="space-y-6 p-4 lg:p-8">
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                <StatCard title="Active incidents" value={String(dashboardMetrics.active_incidents)} delta="Real-time count" icon="⚠️" />
                <StatCard title="Average MTTR" value={`${dashboardMetrics.average_mttr_minutes || 0} min`} delta="System average" icon="⏱️" />
                <StatCard title="Resolved memory" value={String(dashboardMetrics.resolved_incidents)} delta="Persisted incidents" icon="🧠" />
                <StatCard title="Knowledge records" value={String(dashboardMetrics.knowledge_records)} delta="Knowledge entries" icon="📚" />
              </div>

              <NotificationsPanel />
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-2">
                  <SummaryCard label="Active incidents" value={String(dashboardMetrics.active_incidents)} status={dashboardMetrics.active_incidents > 0 ? "critical" : "healthy"} />
                  <SummaryCard label="Total incidents" value={String(dashboardMetrics.total_incidents)} status="healthy" />
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <SectionHeader title="Service health" subtitle="Real-time status" />
                    <button className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                      View all services
                    </button>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {healthData.map((health) => (
                      <HealthRow key={health.service} {...health} />
                    ))}
                  </ul>
                </div>
              </div>

              <aside className="space-y-6">
                <ChartPlaceholder title="Service Health Trend" />
                <ChartPlaceholder title="Incident Frequency" />
              </aside>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <SectionHeader title="Recent incidents" subtitle="Latest events" />
                  <button className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                    View all
                  </button>
                </div>
                {loading ? (
                  <p className="text-sm text-slate-400">Loading incidents...</p>
                ) : (
                  <IncidentTable incidents={incidentsList} />
                )}
              </div>

              <div className="space-y-6">
                <QuickActionCard />
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
                  <SectionHeader title="Incident summary" subtitle="Key metrics" />
                  <div className="mt-6 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-950 p-4">
                      <p className="font-medium text-white">Total tracked</p>
                      <p className="mt-2">{dashboardMetrics.total_incidents}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950 p-4">
                      <p className="font-medium text-white">Pending memory review</p>
                      <p className="mt-2">{dashboardMetrics.pending_memory_review}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950 p-4">
                      <p className="font-medium text-white">Knowledge records</p>
                      <p className="mt-2">{dashboardMetrics.knowledge_records}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950 p-4">
                      <p className="font-medium text-white">Avg MTTR</p>
                      <p className="mt-2">{dashboardMetrics.average_mttr_minutes} min</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
