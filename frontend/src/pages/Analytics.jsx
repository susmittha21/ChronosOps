import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import Card from '../components/ui/Card.jsx'
import FilterBar from '../components/analytics/FilterBar.jsx'

const kpiData = [
  { title: 'Incidents', value: '24', delta: '+8% compared to last week', icon: '⚠️' },
  { title: 'Resolved', value: '19', delta: '+12% better throughput', icon: '✅' },
  { title: 'MTTR', value: '16m', delta: '-3m faster than before', icon: '⏱️' },
  { title: 'Knowledge reuse', value: '81%', delta: '+14% adoption', icon: '🧠' },
]

const trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const trendValues = [12, 18, 14, 20, 16, 22, 25]

function Analytics() {
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
                        <div className="w-full rounded-t-2xl bg-indigo-500" style={{ height: `${value * 6}px` }} />
                        <span className="text-xs uppercase tracking-[0.25em] text-slate-500">{trendLabels[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card title="Incident statistics">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Critical incidents</p>
                    <p className="mt-2 text-2xl font-semibold text-white">4</p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Average recovery time</p>
                    <p className="mt-2 text-2xl font-semibold text-white">18m</p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">SLA adherence</p>
                    <p className="mt-2 text-2xl font-semibold text-white">96%</p>
                  </div>
                </div>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card title="Service breakdown">
                <div className="space-y-3">
                  {['Payment API', 'Authentication', 'Database', 'Redis'].map((service, index) => (
                    <div key={service} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-200">{service}</span>
                        <span className="text-slate-400">{[82, 74, 68, 91][index]}%</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-800">
                        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${[82, 74, 68, 91][index]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Insight summary">
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-8 text-sm leading-7 text-slate-400">
                  Placeholder analytics insight: incident frequency is trending upward during peak hours, and the knowledge base is reducing recovery time.
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
