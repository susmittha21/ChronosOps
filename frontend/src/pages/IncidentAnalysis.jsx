import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import ProgressCard from '../components/analysis/ProgressCard.jsx'
import InfoList from '../components/analysis/InfoList.jsx'
import EvidenceList from '../components/analysis/EvidenceList.jsx'
import RecommendationPanel from '../components/analysis/RecommendationPanel.jsx'

const incidentInfo = [
  { label: 'Incident ID', value: 'INC-1052' },
  { label: 'Detected', value: '08:10 UTC' },
  { label: 'Service', value: 'Payment API' },
  { label: 'Severity', value: 'Critical' },
]

const evidence = [
  'Database connection pool hit 98% saturation during the incident window.',
  'Error rate rose from 0.4% to 18.7% between 08:10 and 08:24 UTC.',
  'Memory pressure increased sharply before the rollout began.',
]

const similarIncidents = [
  'INC-1024 — Connection pool exhaustion after deployment',
  'INC-1006 — Redis failover caused elevated latency',
]

const recommendations = [
  'Throttle background jobs and increase connection pool limits.',
  'Roll back the latest deployment if rollback window is available.',
  'Notify the database team and enable failover monitoring.',
]

function IncidentAnalysis() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 lg:min-w-0">
          <Topbar />
          <main className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Card title="Incident details">
                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Summary</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">Payment API experienced a major database connection failure.</h2>
                    <p className="mt-3 text-sm text-slate-400">
                      The incident appears to have started after a spike in connection saturation and an increase in error rate.
                    </p>
                  </div>
                  <InfoList items={incidentInfo} />
                </div>
              </Card>

              <Card title="Analysis progress">
                <div className="space-y-4">
                  <ProgressCard title="Signal correlation" subtitle="Correlating service and database events" progress={78} />
                  <ProgressCard title="Root cause assessment" subtitle="Comparing against prior incidents" progress={64} />
                  <ProgressCard title="Simulation readiness" subtitle="Preparing remediation steps" progress={52} />
                </div>
              </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
              <Card title="Root cause section">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm font-semibold text-white">Most probable root cause</p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    An exhausted connection pool and a delayed database failover caused requests to queue and eventually fail.
                  </p>
                </div>
              </Card>

              <Card title="Evidence">
                <EvidenceList items={evidence} />
              </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
              <Card title="Similar incidents">
                <ul className="space-y-3">
                  {similarIncidents.map((item) => (
                    <li key={item} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>

              <RecommendationPanel title="Recommended actions" items={recommendations} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <Card title="AI placeholder">
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-10 text-center text-sm text-slate-400">
                  AI-based reasoning and remediation suggestions will appear here once connected.
                </div>
              </Card>

              <Card title="Next action">
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">Start the simulation workflow to validate the recommended mitigation plan.</p>
                  <button className="inline-flex items-center justify-center rounded-3xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
                    Run simulation
                  </button>
                </div>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default IncidentAnalysis
