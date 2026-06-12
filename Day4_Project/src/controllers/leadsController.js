const { createLead, getAllLeads, updateLeadStatus, approveLead: approveLeadQuery } = require('../db/leadsQueries');
const leadEvents = require('../events/leadEvents');

const VALID_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost'];

async function postLead(req, res) {
  const { name, email, phone, company, source, notes, assigned_to } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ error: 'a valid email is required' });
  }

  try {
    const lead = await createLead({ name, email, phone, company, source, notes, assigned_to });
    res.status(201).json(lead);
    setImmediate(() => leadEvents.emit('lead.created', lead));
    return;
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create lead' });
  }
}

async function listLeads(req, res) {
  const { status } = req.query;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  try {
    const leads = await getAllLeads(status);
    return res.status(200).json(leads);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
}

async function patchLeadStatus(req, res) {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Lead ID must be a number' });
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
    const lead = await updateLeadStatus(id, status);
    if (!lead) {
      return res.status(404).json({ error: `Lead ${id} not found` });
    }
    return res.status(200).json(lead);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update lead' });
  }
}

async function approveLeadHandler(req, res) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Lead ID must be a number' });
  }

  try {
    const lead = await approveLeadQuery(id);
    if (!lead) {
      return res.status(404).json({ error: `Lead ${id} not found` });
    }
    return res.status(200).json(lead);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to approve lead' });
  }
}

module.exports = { postLead, listLeads, patchLeadStatus, approveLeadHandler };
