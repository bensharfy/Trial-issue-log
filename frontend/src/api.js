async function request(url, options = {}) {
  const res = await fetch(url, options)

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }

  const contentType = res.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return null
  }

  return res.json()
}

export function getIssues(filters = {}) {
  const params = new URLSearchParams()

  if (filters.title) {
    params.set('title', filters.title)
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  if (filters.severity) {
    params.set('severity', filters.severity)
  }

  const qs = params.toString()

  return request(`/issues${qs ? '?' + qs : ''}`)
}

export function createIssue(data) {
  return request('/issues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateIssue(id, data) {
  return request(`/issues/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function deleteIssue(id) {
  return request(`/issues/${id}`, { method: 'DELETE' })
}

export function importCSV(file) {
  const form = new FormData()
  form.append('file', file)

  return request('/issues/import', { method: 'POST', body: form })
}
