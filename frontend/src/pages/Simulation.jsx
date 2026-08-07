import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import ComparisonCard from '../components/simulation/ComparisonCard.jsx'

function Simulation() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 lg:min-w-0">
          <Topbar />
          <main className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Card title="Simulation input">
                <div className="space-y-4">
                  <label className="block text-sm text-slate-300">
                    <span className="mb-2 block font-medium text-slate-100">Scenario</span>
                    <textarea
                      rows={6}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                      placeholder="Describe the change or mitigation scenario to simulate."
                    />
                  </label>
                  <Button variant="primary">Run Simulation</Button>
                </div>
              </Card>

              <Card title="Expected impact">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Estimated recovery time</p>
                    <p className="mt-2 text-2xl font-semibold text-white">12 minutes</p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Projected error reduction</p>
                    <p className="mt-2 text-2xl font-semibold text-white">78%</p>
                  </div>
                </div>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <ComparisonCard
                title="Before"
                items={['Error rate at 18.7%', 'Avg. response time at 4.2s', 'Manual mitigation required']}
              />
              <ComparisonCard
                title="After"
                items={['Error rate reduced to 4.1%', 'Avg. response time at 1.1s', 'Self-healing path enabled']}
              />
            </section>

            <Card title="Results">
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-8 text-sm leading-7 text-slate-400">
                Placeholder simulation results: the proposed mitigation plan should reduce incident impact and shorten recovery time.
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Simulation
