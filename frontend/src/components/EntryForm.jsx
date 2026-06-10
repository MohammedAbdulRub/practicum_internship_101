import { useState } from 'react'
import { postLog } from '../api'

const today = () => {
  const d = new Date()
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

export default function EntryForm({ onSaved }) {
  const [form, setForm] = useState({ date: today(), location: '', sales: '', customers: '' })
  const [status, setStatus] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('saving')
    try {
      await postLog({
        date: form.date,
        sector: 'restaurant',
        location: form.location.trim(),
        sales: parseFloat(form.sales),
        customers: parseInt(form.customers, 10),
      })
      setStatus('saved')
      onSaved()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="form-card">
      <h2 className="form-heading">Log Today&apos;s Entry</h2>
      <form onSubmit={handleSubmit} className="form-row">
        <label className="form-label">
          Date
          <input type="date" name="date" value={form.date} onChange={handleChange} required className="form-input" />
        </label>
        <label className="form-label">
          Sector
          <input type="text" value="Restaurant" disabled className="form-input" />
        </label>
        <label className="form-label">
          Location
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            placeholder="e.g. Downtown"
            className="form-input"
          />
        </label>
        <label className="form-label">
          Sales ($)
          <input type="number" name="sales" value={form.sales} onChange={handleChange} min="0" step="0.01" required placeholder="0.00" className="form-input" />
        </label>
        <label className="form-label">
          Customers
          <input type="number" name="customers" value={form.customers} onChange={handleChange} min="0" required placeholder="0" className="form-input" />
        </label>
        <button type="submit" disabled={status === 'saving'} className="btn-save">
          {status === 'saving' ? 'Saving…' : 'Save Entry'}
        </button>
        {status === 'saved' && <span className="status-ok">Saved!</span>}
        {status === 'error' && <span className="status-err">Error saving.</span>}
      </form>
    </section>
  )
}
