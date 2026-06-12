const { Router } = require('express');
const { postLead, listLeads, patchLeadStatus, approveLeadHandler } = require('../controllers/leadsController');

const router = Router();

router.post('/', postLead);
router.get('/', listLeads);
router.patch('/:id/approve', approveLeadHandler);
router.patch('/:id/status', patchLeadStatus);

module.exports = router;
