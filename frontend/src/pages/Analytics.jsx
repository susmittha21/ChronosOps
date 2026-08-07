import { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import Card from '../components/ui/Card.jsx'
import FilterBar from '../components/analytics/FilterBar.jsx'
import { getAnalyticsSummary } from '../services/incidentService.js'

const trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const trendValues = [2, 5, 3, 8, 4, 6, 7]

function Analytics() {
  const [summaryData, setSummaryData] = useState({
    total_incidents: 0,
    resolved_incidents: 0,
    average_mttr_minutes: 0,
    status_breakdown: {},
    service_recovery: [],
    categories: [],
  })

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getAnalyticsSummary()
        if (data) setSummaryData(data)
      } catch (err) {
        console.error('Failed to load analytics summary:', err)
      }
    }
    loadAnalytics()
  }, [])

  const kpiData = [
    { title: 'Total Incidents', value: String(summaryData.total_incidents), delta: 'System count', icon: '⚠️' },
    { title: 'Resolved', value: String(summaryData.resolved_incidents), delta: 'Completed resolutions', icon: '✅' },
    { title: 'Avg MTTR', value: `${summaryData.average_mttr_minutes}m`, delta: 'Mean recovery time', icon: '⏱️' },
    { title: 'Categories Tracked', value: String(summaryData.categories?.length || 0), delta: 'Distinct categories', icon: '🧠' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 lg:min-w-0">
          <Topbar />
          <main className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
            <FilterBar />

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {kpiData.map((item) => (
                <StatCard key={item.title} {...item} />
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Card title="Trends">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex items-end gap-3">
                    {trendValues.map((value, index) => (
                      <div key={trendLabels[index]} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full rounded-t-2xl bg-indigo-500" style={{ height: `${value * 12}px` }} />
                        <span className="text-xs uppercase tracking-[0.25em] text-slate-500">{trendLabels[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card title="Status breakdown">
                <div className="space-y-4">
                  {Object.entries(summaryData.status_breakdown || {}).map(([st, count]) => (
                    <div key={st} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                      <p className="text-sm text-slate-400">{st}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{count}</p>
                    </div>
                  ))}
                  {Object.keys(summaryData.status_breakdown || {}).length === 0 && (
                    <p className="text-sm text-slate-400">No status breakdown data recorded.</p>
                  )}
                </div>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card title="Service recovery breakdown">
                <div className="space-y-3">
                  {summaryData.service_recovery?.length > 0 ? (
                    summaryData.service_recovery.map((item) => (
                      <div key={item.service} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-200">{item.service}</span>
                          <span className="text-slate-400">Avg MTTR: {item.avg_mttr}m</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">No service recovery metrics available yet.</p>
                  )}
                </div>
              </Card>

              <Card title="Most Common Incident Categories">
                <div className="space-y-3">
                  {summaryData.categories?.length > 0 ? (
                    summaryData.categories.map((cat) => (
                      <div key={cat.category} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex justify-between items-center text-sm">
                        <span className="text-slate-200">{cat.category}</span>
                        <span className="font-semibold text-indigo-400">{cat.count} incident(s)</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">No categories logged yet.</p>
                  )}
                </div>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Analytics
