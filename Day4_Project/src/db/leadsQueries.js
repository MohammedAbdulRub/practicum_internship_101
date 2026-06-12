const pool = require('./index');

async function createLead({ name, email, phone, company, source, notes, assigned_to }) {
  const { rows } = await pool.query(
    `INSERT INTO leads (name, email, phone, company, source, notes, assigned_to)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, email, phone ?? null, company ?? null, source ?? null, notes ?? null, assigned_to ?? null]
  );
  return rows[0];
}

async function getAllLeads(status) {
  if (status) {
    const { rows } = await pool.query(
      `SELECT * FROM leads WHERE status = $1 ORDER BY created_at DESC`,
      [status]
    );
    return rows;
  }
  const { rows } = await pool.query(
    `SELECT * FROM leads ORDER BY created_at DESC`
  );
  return rows;
}

async function updateLeadStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE leads SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0] ?? null;
}

async function markPendingApproval(id) {
  await pool.query(
    `UPDATE leads SET pending_approval = true WHERE id = $1`,
    [id]
  );
}

async function approveLead(id) {
  const { rows } = await pool.query(
    `UPDATE leads SET pending_approval = false WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ?? null;
}

module.exports = { createLead, getAllLeads, updateLeadStatus, markPendingApproval, approveLead };
