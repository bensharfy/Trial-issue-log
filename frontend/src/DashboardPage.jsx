import { useState, useEffect } from 'react'
import * as api from './api'

export default function DashboardPage() {
  const [issues, setIssues] = useState([])

  useEffect(() => {
    api.getIssues().then(setIssues).catch(console.error)
  }, [])

  const byStatus = {
    open: issues.filter(i => i.status === 'open').length,
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  }

  const bySeverity = {
    minor: issues.filter(i => i.severity === 'minor').length,
    major: issues.filter(i => i.severity === 'major').length,
    critical: issues.filter(i => i.severity === 'critical').length,
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>By Status</h3>
      <div className="chips">
        <span className="chip">Open: {byStatus.open}</span>
        <span className="chip">In Progress: {byStatus.in_progress}</span>
        <span className="chip">Resolved: {byStatus.resolved}</span>
      </div>
      <h3>By Severity</h3>
      <div className="chips">
        <span className="chip">Minor: {bySeverity.minor}</span>
        <span className="chip">Major: {bySeverity.major}</span>
        <span className="chip">Critical: {bySeverity.critical}</span>
      </div>
    </div>
  )
}
