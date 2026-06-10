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
    <div className="stat-tile">
      <div className="stat-tile-label">{label}</div>
      <div className="stat-tile-value">{value}</div>
    </div>
  )
}

export default function Dashboard({ summary, selectedLocation, onLocationChange }) {
  if (!summary) return <p className="empty-chart">Loading…</p>

  const { totals, time_series, today, locations } = summary

  return (
    <section className="dashboard-card">
      <div className="dashboard-header">
        <h2 className="dashboard-heading">Dashboard</h2>
        <div className="location-filter">
          <label className="form-label" htmlFor="loc-select">
            Filter by location
          </label>
          <select
            id="loc-select"
            className="form-input location-select"
            value={selectedLocation ?? ''}
            onChange={e => onLocationChange(e.target.value || null)}
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stat-grid">
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
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={time_series} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8d5c4" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#7a6057' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#7a6057' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#7a6057' }} />
              <Tooltip contentStyle={{ borderRadius: 10, borderColor: '#e8d5c4', fontFamily: 'Nunito, sans-serif' }} />
              <Legend wrapperStyle={{ fontFamily: 'Nunito, sans-serif', fontSize: 13 }} />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8b1a2d" strokeWidth={2} name="Sales ($)" dot={{ r: 4, fill: '#8b1a2d' }} />
              <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#e8955a" strokeWidth={2} name="Customers" dot={{ r: 4, fill: '#e8955a' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="empty-chart">No entries yet — use the form above to log your first day.</p>
      )}
    </section>
  )
}
