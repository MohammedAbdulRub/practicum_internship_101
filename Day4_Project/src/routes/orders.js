const { Router } = require('express');
const { postOrder, listOrders, getOrder, patchOrderStatus } = require('../controllers/ordersController');

const router = Router();

router.post('/', postOrder);
router.get('/', listOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', patchOrderStatus);

module.exports = router;
