import { useState, useEffect, useCallback } from 'react'
import { getSummary } from './api'
import EntryForm from './components/EntryForm'
import Dashboard from './components/Dashboard'

export default function App() {
  const [summary, setSummary] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)

  const refresh = useCallback(async () => {
    try {
      setSummary(await getSummary(selectedLocation))
    } catch {
      setSummary(null)
    }
  }, [selectedLocation])

  useEffect(() => { refresh() }, [refresh])

  return (
    <div className="app-wrapper">
      <h1 className="app-title">Restaurant Daily Logger</h1>
      <EntryForm onSaved={refresh} />
      <Dashboard
        summary={summary}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
    </div>
  )
}
