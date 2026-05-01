import { useState, useEffect, useRef } from 'react'
import * as api from './api'

const SEVERITIES = ['minor', 'major', 'critical']
const STATUSES = ['open', 'in_progress', 'resolved']
const EMPTY_FORM = { title: '', description: '', site: '', severity: 'minor', status: 'open' }

function CreateIssueModal({ onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      await onSubmit(form)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form className="modal form" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
        <h3>New Issue</h3>
        {error && <p className="error">{error}</p>}
        <label>
          Title *
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label>
          Description *
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>
        <label>
          Site
          <input
            value={form.site}
            onChange={e => setForm({ ...form, site: e.target.value })}
            placeholder="e.g. Site-101"
          />
        </label>
        <div className="form-row">
          <label>
            Severity
            <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
              {SEVERITIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>
            Status
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Create</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default function IssuesPage() {
  const [issues, setIssues] = useState([])
  const [filters, setFilters] = useState({ title: '', status: '', severity: '' })
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  useEffect(() => {
    loadIssues()
  }, [filters])

  async function loadIssues() {
    try {
      const data = await api.getIssues(filters)
      setIssues(data)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCreate(data) {
    await api.createIssue(data)
    setShowForm(false)
    loadIssues()
  }

  async function handleResolve(id) {
    try {
      await api.updateIssue(id, { status: 'resolved' })
      loadIssues()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this issue?')) {
      return
    }

    try {
      await api.deleteIssue(id)
      loadIssues()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleImport(e) {
    const file = e.target.files[0]
    if (!file) {
      return
    }

    try {
      await api.importCSV(file)
      loadIssues()
    } catch (err) {
      setError(err.message)
    }

    e.target.value = ''
  }

  function handleNewIssue() {
    setShowForm(true)
    setError('')
  }

  function handleCancel() {
    setShowForm(false)
  }

  return (
    <div>
      <div className="toolbar">
        <button onClick={handleNewIssue}>+ New Issue</button>
        <button onClick={() => fileRef.current.click()}>Import CSV</button>
        <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
      </div>

      {showForm && (
        <CreateIssueModal
          onSubmit={handleCreate}
          onCancel={handleCancel}
        />
      )}

      {error && <p className="error">{error}</p>}

      <div className="filters">
        <input
          placeholder="Search title..."
          value={filters.title}
          onChange={e => setFilters({ ...filters, title: e.target.value })}
        />
        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filters.severity} onChange={e => setFilters({ ...filters, severity: e.target.value })}>
          <option value="">All severities</option>
          {SEVERITIES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Site</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr key={issue.id}>
              <td>{issue.title}</td>
              <td>{issue.site}</td>
              <td>{issue.severity}</td>
              <td>{issue.status}</td>
              <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
              <td className="actions">
                {issue.status !== 'resolved' && (
                  <button onClick={() => handleResolve(issue.id)}>Resolve</button>
                )}
                <button onClick={() => handleDelete(issue.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {issues.length === 0 && (
            <tr>
              <td colSpan={6} className="empty">No issues found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
