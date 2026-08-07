import { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import ProgressCard from '../components/analysis/ProgressCard.jsx'
import InfoList from '../components/analysis/InfoList.jsx'
import EvidenceList from '../components/analysis/EvidenceList.jsx'
import RecommendationPanel from '../components/analysis/RecommendationPanel.jsx'
import { getIncidents, runIncidentAnalysis, runSimulation } from '../services/incidentService.js'

function IncidentAnalysis() {
  const [incidents, setIncidents] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [incidentData, setIncidentData] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [simResult, setSimResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [simulating, setSimulating] = useState(false)

  useEffect(() => {
    async function loadIncidents() {
      try {
        setLoading(true)
        const list = await getIncidents()
        if (Array.isArray(list) && list.length > 0) {
          setIncidents(list)
          setSelectedId(String(list[0].id))
          setIncidentData(list[0])
        }
      } catch (err) {
        console.error('Failed to fetch incidents list:', err)
      } finally {
        setLoading(false)
      }
    }
    loadIncidents()
  }, [])

  const handleSelectIncident = (idStr) => {
    setSelectedId(idStr)
    const found = incidents.find((i) => String(i.id) === idStr)
    setIncidentData(found || null)
    setAnalysisResult(null)
    setSimResult(null)
  }

  const handleRunAnalysis = async () => {
    if (!selectedId) return
    try {
      setAnalyzing(true)
      const res = await runIncidentAnalysis(Number(selectedId))
      setAnalysisResult(res)
    } catch (err) {
      console.error('AI Analysis failed:', err)
      setAnalysisResult({
        status: 'error',
        message: err.message || 'AI analysis request failed.',
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleRunSimulation = async () => {
    if (!selectedId) return
    try {
      setSimulating(true)
      const res = await runSimulation(Number(selectedId), 'RESTART_SERVICE')
      setSimResult(res)
    } catch (err) {
      console.error('Simulation failed:', err)
      setSimResult({ message: err.message || 'Simulation execution failed.' })
    } finally {
      setSimulating(false)
    }
  }

  const incidentInfo = incidentData ? [
    { label: 'Incident ID', value: `INC-${incidentData.id}` },
    { label: 'Status', value: incidentData.status },
    { label: 'Service', value: incidentData.service },
    { label: 'Severity', value: incidentData.severity },
  ] : []

  const recommendations = analysisResult?.recommended_next_steps || [
    'Run AI Analysis to extract automated recommendations.',
    'Review connection limits and service metrics.',
    'Test safe remediation using simulation.',
  ]

  const similarList = analysisResult?.similar_incidents?.map(
    (item) => `INC-${item.incident_id} (${Math.round((item.similarity || 0) * 100)}% match) — ${item.title}`
  ) || []

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 lg:min-w-0">
          <Topbar />
          <main className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-white">AI Incident Analysis & Diagnostics</h1>
                  <p className="text-sm text-slate-400">Select an incident to trigger vector memory search & AI root-cause reasoning.</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedId}
                    onChange={(e) => handleSelectIncident(e.target.value)}
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 outline-none"
                  >
                    {incidents.length === 0 && <option value="">No incidents found</option>}
                    {incidents.map((inc) => (
                      <option key={inc.id} value={String(inc.id)}>
                        INC-{inc.id}: {inc.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRunAnalysis}
                    disabled={analyzing || !selectedId}
                    className="inline-flex items-center justify-center rounded-3xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
                  >
                    {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
                  </button>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Card title="Incident details">
                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Summary</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">
                      {incidentData ? incidentData.title : 'No Incident Selected'}
                    </h2>
                    <p className="mt-3 text-sm text-slate-400">
                      {incidentData ? incidentData.description : 'Select an incident to view diagnosis context.'}
                    </p>
                  </div>
                  <InfoList items={incidentInfo} />
                </div>
              </Card>

              <Card title="Analysis progress">
                <div className="space-y-4">
                  <ProgressCard title="Signal correlation" subtitle="Correlating service logs and metrics" progress={analysisResult ? 100 : 30} />
                  <ProgressCard title="Root cause assessment" subtitle="FAISS Vector memory search" progress={analysisResult ? 100 : 20} />
                  <ProgressCard title="Simulation readiness" subtitle="Preparing safe remediation" progress={simResult ? 100 : 40} />
                </div>
              </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
              <Card title="AI Reasoning & Root Cause">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm font-semibold text-white">AI Analysis Output</p>
                  <div className="mt-3 text-sm leading-7 text-slate-300 whitespace-pre-wrap">
                    {analysisResult?.analysis || 'Click "Run AI Analysis" to trigger RAG vector retrieval & Gemini explanation.'}
                  </div>
                </div>
              </Card>

              <Card title="Evidence & Signals">
                <EvidenceList items={[
                  `Service: ${incidentData?.service || 'N/A'}`,
                  `Severity Level: ${incidentData?.severity || 'N/A'}`,
                  `Error Log: ${incidentData?.error_message || 'None reported'}`,
                ]} />
              </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
              <Card title="Vector Memory - Similar Incidents">
                {similarList.length > 0 ? (
                  <ul className="space-y-3">
                    {similarList.map((item) => (
                      <li key={item} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">Run AI Analysis to fetch top FAISS vector matches from historical memory.</p>
                )}
              </Card>

              <RecommendationPanel title="Recommended actions" items={recommendations} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <Card title="Remediation Simulation">
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-6 text-sm text-slate-300 space-y-3">
                  {simResult ? (
                    <div>
                      <p className="font-semibold text-emerald-400">Simulation Status: {simResult.status}</p>
                      <p className="mt-1 text-slate-300">{simResult.message}</p>
                      {simResult.steps && (
                        <ul className="mt-3 list-disc list-inside space-y-1 text-xs text-slate-400">
                          {simResult.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400">Click "Run simulation" below to execute non-destructive safe remediation checks.</p>
                  )}
                </div>
              </Card>

              <Card title="Next action">
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">Validate the proposed mitigation plan safely without changing production infrastructure.</p>
                  <button
                    onClick={handleRunSimulation}
                    disabled={simulating || !selectedId}
                    className="inline-flex items-center justify-center rounded-3xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
                  >
                    {simulating ? 'Simulating...' : 'Run simulation'}
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
