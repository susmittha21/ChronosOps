import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import NewIncident from './pages/NewIncident.jsx'
import IncidentAnalysis from './pages/IncidentAnalysis.jsx'
import KnowledgeMemory from './pages/KnowledgeMemory.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewIncident />} />
        <Route path="/analysis" element={<IncidentAnalysis />} />
        <Route path="/knowledge" element={<KnowledgeMemory />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
