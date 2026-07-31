const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAvailableOrders,
  assignOrder,
  cancelOrder,  // ← ADD THIS
} = require('../controllers/orderController');
const { createReview } = require('../controllers/reviewController');
const validate = require('../middlewares/validate');
const {
  createOrderSchema,
  updateOrderStatusSchema,
} = require('../validators/orderValidators');
const { createReviewSchema } = require('../validators/reviewValidators');
const { authenticate, authorize } = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('CUSTOMER'), validate(createOrderSchema), createOrder);
router.get('/', getMyOrders);

// IMPORTANT: Specific routes must come BEFORE dynamic routes with :id
router.get('/available', authorize('DELIVERY_PARTNER'), getAvailableOrders);
router.patch('/:id/cancel', authorize('CUSTOMER'), cancelOrder);  // ← ADD THIS HERE
router.get('/:id', getOrderById);
router.patch(
  '/:id/status',
  authorize('RESTAURANT_OWNER', 'DELIVERY_PARTNER'),
  validate(updateOrderStatusSchema),
  updateOrderStatus
);
router.patch('/:id/assign', authorize('DELIVERY_PARTNER'), assignOrder);
router.post('/:id/review', authorize('CUSTOMER'), validate(createReviewSchema), createReview);

module.exports = router;