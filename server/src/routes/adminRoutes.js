const express = require('express');
const {
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  getStats,
  updateUserRole,
} = require('../controllers/adminController');
const validate = require('../middlewares/validate');
const { updateRoleSchema } = require('../validators/adminValidators');
const { authenticate, authorize } = require('../middlewares/authenticate');

const router = express.Router();

// Every admin route requires a logged-in ADMIN.
router.use(authenticate, authorize('ADMIN'));

router.get('/users', getAllUsers);
router.get('/restaurants', getAllRestaurants);
router.get('/orders', getAllOrders);
router.get('/stats', getStats);
router.patch('/users/:id/role', validate(updateRoleSchema), updateUserRole);

module.exports = router;