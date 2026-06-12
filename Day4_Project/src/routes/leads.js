const { Router } = require('express');
const { postLead, listLeads, patchLeadStatus } = require('../controllers/leadsController');

const router = Router();

router.post('/', postLead);
router.get('/', listLeads);
router.patch('/:id/status', patchLeadStatus);

module.exports = router;
