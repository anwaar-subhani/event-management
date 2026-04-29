const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export function getAuthToken() {
  return localStorage.getItem('organizerToken')
}

export function clearAuth() {
  localStorage.removeItem('organizerToken')
  localStorage.removeItem('organizerProfile')
}

export async function apiRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const isFormData = options.body instanceof FormData
  const headers = {
    ...(options.headers || {}),
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return payload
}
