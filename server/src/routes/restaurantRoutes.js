const express = require('express');
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurantController');
const { getReviewsForRestaurant } = require('../controllers/reviewController');
const validate = require('../middlewares/validate');
const {
  createRestaurantSchema,
  updateRestaurantSchema,
} = require('../validators/restaurantValidators');
const { authenticate, authorize } = require('../middlewares/authenticate');
const menuItemRoutes = require('./menuItemRoutes');

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/reviews', getReviewsForRestaurant);

router.post(
  '/',
  authenticate,
  authorize('RESTAURANT_OWNER'),
  validate(createRestaurantSchema),
  createRestaurant
);
router.patch(
  '/:id',
  authenticate,
  authorize('RESTAURANT_OWNER'),
  validate(updateRestaurantSchema),
  updateRestaurant
);
router.delete(
  '/:id',
  authenticate,
  authorize('RESTAURANT_OWNER'),
  deleteRestaurant
);

// Nested: /api/restaurants/:restaurantId/menu-items
router.use('/:restaurantId/menu-items', menuItemRoutes);

module.exports = router;