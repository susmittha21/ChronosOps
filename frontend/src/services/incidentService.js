import { fetchJson } from './api.js'

export function getIncidents(query = '') {
  const params = new URLSearchParams()
  if (query) params.set('q', query)

  return fetchJson(`/incidents?${params.toString()}`)
}
