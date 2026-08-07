import { fetchJson } from './api.js'

export function getIncidents(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.service) params.set('service', filters.service)

  const queryStr = params.toString() ? `?${params.toString()}` : ''
  return fetchJson(`/incidents${queryStr}`)
}

export function getIncidentById(incidentId) {
  return fetchJson(`/incidents/${incidentId}`)
}

export function createIncident(payload) {
  return fetchJson('/incidents', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateIncident(incidentId, payload) {
  return fetchJson(`/incidents/${incidentId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function resolveIncident(incidentId, payload) {
  return fetchJson(`/incidents/${incidentId}/resolve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function saveIncidentToKnowledge(incidentId, payload) {
  return fetchJson(`/knowledge/incidents/${incidentId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getKnowledgeRecords(query = '') {
  const params = new URLSearchParams()
  if (query) params.set('query', query)

  const queryStr = params.toString() ? `?${params.toString()}` : ''
  return fetchJson(`/knowledge${queryStr}`)
}

export function getKnowledgeRecordById(knowledgeId) {
  return fetchJson(`/knowledge/${knowledgeId}`)
}

export function getDashboardData() {
  return fetchJson('/dashboard')
}

export function runSimulation(incidentId, action = 'RESTART_SERVICE') {
  return fetchJson('/simulation', {
    method: 'POST',
    body: JSON.stringify({ incident_id: incidentId, action }),
  })
}

export function runIncidentAnalysis(incidentId) {
  return fetchJson('/analysis', {
    method: 'POST',
    body: JSON.stringify({ incident_id: incidentId }),
  })
}

export function getAnalyticsSummary() {
  return fetchJson('/analytics/summary')
}

