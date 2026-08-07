import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import KnowledgeCard from '../components/knowledge/KnowledgeCard.jsx'
import KnowledgeFilters from '../components/knowledge/KnowledgeFilters.jsx'

const knowledgeItems = [
  {
    title: 'Connection pool exhaustion after deployment',
    service: 'Payment API',
    summary: 'Increasing pool size and rolling back the deployment reduced errors quickly.',
    confidence: 94,
    date: 'May 20',
    active: true,
  },
  {
    title: 'Redis failover during peak traffic',
    service: 'Redis Cache',
    summary: 'Failover to replica improved latency and restored normal traffic flow.',
    confidence: 88,
    date: 'May 17',
  },
  {
    title: 'SSL certificate warning response',
    service: 'Authentication',
    summary: 'Rotating the certificate and restarting the service restored health in 12 minutes.',
    confidence: 90,
    date: 'May 15',
  },
]

function KnowledgeMemory() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 lg:min-w-0">
          <Topbar />
          <main className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-6">
                <KnowledgeFilters />
                <div className="grid gap-4 lg:grid-cols-2">
                  {knowledgeItems.map((item) => (
                    <KnowledgeCard key={item.title} {...item} />
                  ))}
                </div>
              </div>

              <Card title="Knowledge details">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm font-semibold text-white">Selected insight</p>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      The selected record shows that throttling background jobs and increasing pool size reduced incident impact after a deployment issue.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <SectionHeader title="Similar incidents" subtitle="Related cases" />
                    <ul className="mt-4 space-y-2 text-sm text-slate-300">
                      <li className="rounded-2xl border border-slate-800 bg-slate-900 p-3">INC-1024 · Connection pool issue</li>
                      <li className="rounded-2xl border border-slate-800 bg-slate-900 p-3">INC-1006 · Replica failover incident</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 shadow-sm">
              <p className="text-sm text-slate-400">Showing 1–3 of 24 knowledge entries</p>
              <div className="flex items-center gap-3">
                <button className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">Previous</button>
                <span className="rounded-2xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white">1</span>
                <button className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">Next</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default KnowledgeMemory
