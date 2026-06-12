const { Router } = require('express');
const { postCustomer, listCustomers, getCustomer, patchCustomer, removeCustomer } = require('../controllers/customersController');

const router = Router();

router.post('/', postCustomer);
router.get('/', listCustomers);
router.get('/:id', getCustomer);
router.patch('/:id', patchCustomer);
router.delete('/:id', removeCustomer);

module.exports = router;
