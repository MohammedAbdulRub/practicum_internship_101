import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

function StatCard({ label, value }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', minWidth: 140, textAlign: 'center' }}>
      <div style={{ fontSize: '0.85rem', color: '#666' }}>{label}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{value}</div>
    </div>
  )
}

export default function Dashboard({ summary }) {
  if (!summary) return <p>Loading…</p>

  const { totals, time_series, today } = summary

  return (
    <section>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <StatCard label="Total Sales" value={`$${totals.total_sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
        <StatCard label="Total Customers" value={totals.total_customers.toLocaleString()} />
        <StatCard label="Days Logged" value={totals.entry_count} />
        {today && (
          <>
            <StatCard label="Today's Sales" value={`$${today.sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
            <StatCard label="Today's Customers" value={today.customers} />
          </>
        )}
      </div>

      {time_series.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={time_series} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#4f86f7" name="Sales ($)" dot />
            <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#f77f4f" name="Customers" dot />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ color: '#888' }}>No entries yet — use the form above to log your first day.</p>
      )}
    </section>
  )
}
