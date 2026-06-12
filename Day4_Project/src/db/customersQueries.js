const pool = require('./index');

async function createCustomer({ name, email, phone, company }) {
  const { rows } = await pool.query(
    `INSERT INTO customers (name, email, phone, company)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, phone ?? null, company ?? null]
  );
  return rows[0];
}

async function getAllCustomers() {
  const { rows } = await pool.query(
    `SELECT * FROM customers ORDER BY created_at DESC`
  );
  return rows;
}

async function getCustomerById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM customers WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

async function updateCustomer(id, { name, email, phone, company }) {
  const { rows } = await pool.query(
    `UPDATE customers
     SET name    = COALESCE($1, name),
         email   = COALESCE($2, email),
         phone   = COALESCE($3, phone),
         company = COALESCE($4, company)
     WHERE id = $5
     RETURNING *`,
    [name ?? null, email ?? null, phone ?? null, company ?? null, id]
  );
  return rows[0] ?? null;
}

async function deleteCustomer(id) {
  const { rows } = await pool.query(
    `DELETE FROM customers WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ?? null;
}

module.exports = { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };
