import { API_BASE_URL } from '../constants/config.js'

const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export async function fetchJson(path, options = {}) {
  const url = new URL(path, API_BASE_URL)

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
