import { useState } from 'react'
import IssuesPage from './IssuesPage'
import DashboardPage from './DashboardPage'

export default function App() {
  const [page, setPage] = useState('issues')

  return (
    <div>
      <nav className="nav">
        <span className="nav-title">Trial Issue Log</span>
        <button
          className={page === 'issues' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setPage('issues')}
        >
          Issues
        </button>
        <button
          className={page === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setPage('dashboard')}
        >
          Dashboard
        </button>
      </nav>
      <main className="main">
        {page === 'issues' ? <IssuesPage /> : <DashboardPage />}
      </main>
    </div>
  )
}
