import { useState, useEffect, useCallback } from 'react'
import { getSummary } from './api'
import EntryForm from './components/EntryForm'
import Dashboard from './components/Dashboard'

export default function App() {
  const [summary, setSummary] = useState(null)

  const refresh = useCallback(async () => {
    try {
      setSummary(await getSummary())
    } catch {
      setSummary(null)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #4f86f7', paddingBottom: '0.5rem' }}>
        Restaurant Daily Logger
      </h1>
      <EntryForm onSaved={refresh} />
      <Dashboard summary={summary} />
    </div>
  )
}
