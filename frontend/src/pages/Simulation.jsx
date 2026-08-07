import { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import Card from '../components/ui/Card.jsx'
import ComparisonCard from '../components/simulation/ComparisonCard.jsx'
import { getIncidents, runSimulation } from '../services/incidentService.js'

function Simulation() {
  const [incidents, setIncidents] = useState([])
  const [selectedIncidentId, setSelectedIncidentId] = useState('')
  const [action, setAction] = useState('RESTART_SERVICE')
  const [simulationResult, setSimulationResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadIncidents() {
      try {
        const list = await getIncidents()
        if (Array.isArray(list) && list.length > 0) {
          setIncidents(list)
          setSelectedIncidentId(String(list[0].id))
        }
      } catch (err) {
        console.error('Failed to load incidents for simulation:', err)
      }
    }
    loadIncidents()
  }, [])

  const handleRunSimulation = async () => {
    if (!selectedIncidentId) return
    try {
      setLoading(true)
      const res = await runSimulation(Number(selectedIncidentId), action)
      setSimulationResult(res)
    } catch (err) {
      console.error('Failed to run simulation:', err)
      setSimulationResult({
        status: 'ERROR',
        message: err.message || 'Simulation execution failed.',
        steps: [],
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 lg:min-w-0">
          <Topbar />
          <main className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Card title="Simulation setup">
                <div className="space-y-4">
                  <label className="block text-sm text-slate-300">
                    <span className="mb-2 block font-medium text-slate-100">Select Target Incident</span>
                    <select
                      value={selectedIncidentId}
                      onChange={(e) => setSelectedIncidentId(e.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                    >
                      {incidents.length === 0 && <option value="">No incidents available</option>}
                      {incidents.map((inc) => (
                        <option key={inc.id} value={String(inc.id)}>
                          INC-{inc.id}: {inc.title} ({inc.service})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm text-slate-300">
                    <span className="mb-2 block font-medium text-slate-100">Remediation Action</span>
                    <select
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                    >
                      <option value="RESTART_SERVICE">RESTART_SERVICE (Safe restart of service workers)</option>
                      <option value="SCALE_UP_POOL">SCALE_UP_POOL (Increase connection/worker limits)</option>
                      <option value="CLEAR_CACHE">CLEAR_CACHE (Flush cache & re-warm memory)</option>
                    </select>
                  </label>

                  <button
                    onClick={handleRunSimulation}
                    disabled={loading || !selectedIncidentId}
                    className="inline-flex items-center justify-center rounded-3xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
                  >
                    {loading ? 'Executing Simulation...' : 'Run Simulation'}
                  </button>
                </div>
              </Card>

              <Card title="Expected impact">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Estimated recovery time</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {simulationResult ? '12 minutes' : 'Pending test'}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Environment Impact</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-400">Safe (Non-destructive)</p>
                  </div>
                </div>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <ComparisonCard
                title="Current State"
                items={['Active incident impact', 'Service latency elevated', 'Manual triage required']}
              />
              <ComparisonCard
                title="Simulated Post-Remediation"
                items={['Worker nodes healthy', 'Latency normalized', 'Self-healing validation verified']}
              />
            </section>

            <Card title="Simulation Results & Step Breakdown">
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-300">
                {simulationResult ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        {simulationResult.status}
                      </span>
                      <span className="text-white font-medium">{simulationResult.action}</span>
                    </div>
                    <p className="text-slate-400">{simulationResult.message}</p>
                    {simulationResult.steps && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Simulated Execution Steps:</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
                          {simulationResult.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400">Run a simulation above to inspect step-by-step non-destructive remediation logs.</p>
                )}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Simulation
