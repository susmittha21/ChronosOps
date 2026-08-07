import { API_BASE_URL } from '../constants/config.js'

const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

function buildRequestUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const baseUrl = API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:8000')
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return new URL(normalizedPath, normalizedBase)
}

export async function fetchJson(path, options = {}) {
  const url = buildRequestUrl(path)

  const response = await fetch(url.toString(), {
    headers: { ...jsonHeaders, ...(options.headers || {}) },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return response.json()
}
