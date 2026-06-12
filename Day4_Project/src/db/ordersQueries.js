const pool = require('./index');

async function createOrder({ customer_id, product_name, amount }) {
  const { rows } = await pool.query(
    `INSERT INTO orders (customer_id, product_name, amount)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [customer_id, product_name, amount]
  );
  return rows[0];
}

async function getAllOrders({ status, customer_id }) {
  let query = `SELECT * FROM orders`;
  const params = [];
  const conditions = [];

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (customer_id) {
    params.push(customer_id);
    conditions.push(`customer_id = $${params.length}`);
  }

  if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
  query += ` ORDER BY created_at DESC`;

  const { rows } = await pool.query(query, params);
  return rows;
}

async function getOrderById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM orders WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

async function updateOrderStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0] ?? null;
}

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus };
