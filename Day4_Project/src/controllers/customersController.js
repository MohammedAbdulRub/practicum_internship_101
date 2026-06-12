const { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../db/customersQueries');

async function postCustomer(req, res) {
  const { name, email, phone, company } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ error: 'a valid email is required' });
  }

  try {
    const customer = await createCustomer({ name, email, phone, company });
    return res.status(201).json(customer);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A customer with that email already exists' });
    }
    return res.status(500).json({ error: 'Failed to create customer' });
  }
}

async function listCustomers(_req, res) {
  try {
    const customers = await getAllCustomers();
    return res.status(200).json(customers);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch customers' });
  }
}

async function getCustomer(req, res) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Customer ID must be a number' });
  }

  try {
    const customer = await getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ error: `Customer ${id} not found` });
    }
    return res.status(200).json(customer);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch customer' });
  }
}

async function patchCustomer(req, res) {
  const id = parseInt(req.params.id, 10);
  const { name, email, phone, company } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Customer ID must be a number' });
  }
  if (!name && !email && !phone && !company) {
    return res.status(400).json({ error: 'At least one field (name, email, phone, company) is required' });
  }
  if (email !== undefined && !String(email).includes('@')) {
    return res.status(400).json({ error: 'a valid email is required' });
  }

  try {
    const customer = await updateCustomer(id, { name, email, phone, company });
    if (!customer) {
      return res.status(404).json({ error: `Customer ${id} not found` });
    }
    return res.status(200).json(customer);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A customer with that email already exists' });
    }
    return res.status(500).json({ error: 'Failed to update customer' });
  }
}

async function removeCustomer(req, res) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Customer ID must be a number' });
  }

  try {
    const customer = await deleteCustomer(id);
    if (!customer) {
      return res.status(404).json({ error: `Customer ${id} not found` });
    }
    return res.status(200).json(customer);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete customer' });
  }
}

module.exports = { postCustomer, listCustomers, getCustomer, patchCustomer, removeCustomer };
