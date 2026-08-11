import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewIncident from './pages/NewIncident.jsx'
import Incidents from './pages/Incidents.jsx'
import IncidentAnalysis from './pages/IncidentAnalysis.jsx'
import KnowledgeMemory from './pages/KnowledgeMemory.jsx'
import Analytics from './pages/Analytics.jsx'
import Simulation from './pages/Simulation.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewIncident />} />
        <Route path="/analysis" element={<IncidentAnalysis />} />
        <Route path="/knowledge" element={<KnowledgeMemory />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/incidents" element={<Incidents />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
