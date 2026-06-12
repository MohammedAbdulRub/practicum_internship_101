const { createOrder, getAllOrders, getOrderById, updateOrderStatus } = require('../db/ordersQueries');

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

async function postOrder(req, res) {
  const { customer_id, product_name, amount } = req.body;

  if (!customer_id || isNaN(parseInt(customer_id, 10))) {
    return res.status(400).json({ error: 'customer_id must be a valid number' });
  }
  if (!product_name || !String(product_name).trim()) {
    return res.status(400).json({ error: 'product_name is required' });
  }
  if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) < 0) {
    return res.status(400).json({ error: 'amount must be a non-negative number' });
  }

  try {
    const order = await createOrder({ customer_id: parseInt(customer_id, 10), product_name, amount });
    return res.status(201).json(order);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(404).json({ error: `Customer ${customer_id} not found` });
    }
    return res.status(500).json({ error: 'Failed to create order' });
  }
}

async function listOrders(req, res) {
  const { status, customer_id } = req.query;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }
  if (customer_id && isNaN(parseInt(customer_id, 10))) {
    return res.status(400).json({ error: 'customer_id must be a number' });
  }

  try {
    const orders = await getAllOrders({
      status: status || null,
      customer_id: customer_id ? parseInt(customer_id, 10) : null,
    });
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

async function getOrder(req, res) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Order ID must be a number' });
  }

  try {
    const order = await getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: `Order ${id} not found` });
    }
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
}

async function patchOrderStatus(req, res) {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Order ID must be a number' });
  }
  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  try {
    const order = await updateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ error: `Order ${id} not found` });
    }
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update order' });
  }
}

module.exports = { postOrder, listOrders, getOrder, patchOrderStatus };
