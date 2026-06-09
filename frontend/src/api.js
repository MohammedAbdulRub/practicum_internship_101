const BASE = import.meta.env.VITE_API_BASE ?? ''

export async function postLog(entry) {
  const res = await fetch(`${BASE}/api/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getSummary() {
  const res = await fetch(`${BASE}/api/summary`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
