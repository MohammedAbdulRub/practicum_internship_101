import { useState } from 'react'
import { postLog } from '../api'

const today = () => {
  const d = new Date()
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

export default function EntryForm({ onSaved }) {
  const [form, setForm] = useState({ date: today(), sales: '', customers: '' })
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
    <section style={{ marginBottom: '2rem' }}>
      <h2>Log Today&apos;s Entry</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label>
          Date
          <br />
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>
        <label>
          Sector
          <br />
          <input type="text" value="Restaurant" disabled style={{ background: '#f0f0f0' }} />
        </label>
        <label>
          Sales ($)
          <br />
          <input
            type="number"
            name="sales"
            value={form.sales}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            placeholder="0.00"
          />
        </label>
        <label>
          Customers
          <br />
          <input
            type="number"
            name="customers"
            value={form.customers}
            onChange={handleChange}
            min="0"
            required
            placeholder="0"
          />
        </label>
        <button type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save Entry'}
        </button>
        {status === 'saved' && <span style={{ color: 'green' }}>Saved!</span>}
        {status === 'error' && <span style={{ color: 'red' }}>Error saving.</span>}
      </form>
    </section>
  )
}
