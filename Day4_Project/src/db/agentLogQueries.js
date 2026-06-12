const pool = require('./index');

async function logAgent({ lead_id, agent, status, message }) {
  try {
    await pool.query(
      `INSERT INTO agent_logs (lead_id, agent, status, message)
       VALUES ($1, $2, $3, $4)`,
      [lead_id, agent, status, message ?? null]
    );
  } catch (err) {
    console.error('[agent_logs] failed to write log:', err.message);
  }
}

module.exports = { logAgent };
