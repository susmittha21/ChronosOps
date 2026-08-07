import { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import KnowledgeCard from '../components/knowledge/KnowledgeCard.jsx'
import KnowledgeFilters from '../components/knowledge/KnowledgeFilters.jsx'
import { getKnowledgeRecords } from '../services/incidentService.js'

function KnowledgeMemory() {
  const [knowledgeList, setKnowledgeList] = useState([])
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadKnowledge() {
      try {
        setLoading(true)
        const records = await getKnowledgeRecords()
        if (Array.isArray(records)) {
          const formatted = records.map((rec) => ({
            id: rec.id,
            title: rec.title,
            service: rec.service,
            summary: rec.resolution || rec.root_cause || 'No resolution details recorded.',
            confidence: 95,
            date: rec.saved_at ? new Date(rec.saved_at).toLocaleDateString() : 'Saved',
            raw: rec,
          }))
          setKnowledgeList(formatted)
          if (formatted.length > 0) {
            setSelectedRecord(formatted[0])
          }
        }
      } catch (err) {
        console.error('Failed to load knowledge records:', err)
      } finally {
        setLoading(false)
      }
    }
    loadKnowledge()
  }, [])

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
                {loading ? (
                  <p className="text-sm text-slate-400">Loading knowledge records...</p>
                ) : knowledgeList.length === 0 ? (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
                    No Institutional Memory records saved yet. Save a resolved incident to build memory.
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {knowledgeList.map((item) => (
                      <div key={item.id} onClick={() => setSelectedRecord(item)} className="cursor-pointer">
                        <KnowledgeCard {...item} active={selectedRecord?.id === item.id} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Card title="Knowledge details">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm font-semibold text-white">
                      {selectedRecord ? selectedRecord.title : 'Select a record'}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {selectedRecord
                        ? `Root Cause: ${selectedRecord.raw.root_cause || 'N/A'}\n\nResolution: ${selectedRecord.raw.resolution || 'N/A'}\n\nPreventive Action: ${selectedRecord.raw.preventive_action || 'N/A'}`
                        : 'Click on a knowledge card to view stored insight details.'}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <SectionHeader title="Metadata" subtitle="Saved incident details" />
                    <ul className="mt-4 space-y-2 text-sm text-slate-300">
                      <li className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
                        Incident Ref ID: #{selectedRecord?.raw.incident_id || 'N/A'}
                      </li>
                      <li className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
                        Recovery Time: {selectedRecord?.raw.recovery_time_minutes || 0} minutes
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 shadow-sm">
              <p className="text-sm text-slate-400">Total Records: {knowledgeList.length}</p>
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
