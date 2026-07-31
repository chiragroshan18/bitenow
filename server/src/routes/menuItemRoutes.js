const express = require('express');
const {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuItemController');
const validate = require('../middlewares/validate');
const {
  createMenuItemSchema,
  updateMenuItemSchema,
} = require('../validators/menuItemValidators');
const { authenticate, authorize } = require('../middlewares/authenticate');

// mergeParams lets this router read :restaurantId from the parent router
const router = express.Router({ mergeParams: true });

router.get('/', getMenuItems);
router.get('/:itemId', getMenuItemById);

router.post(
  '/',
  authenticate,
  authorize('RESTAURANT_OWNER'),
  validate(createMenuItemSchema),
  createMenuItem
);
router.patch(
  '/:itemId',
  authenticate,
  authorize('RESTAURANT_OWNER'),
  validate(updateMenuItemSchema),
  updateMenuItem
);
router.delete(
  '/:itemId',
  authenticate,
  authorize('RESTAURANT_OWNER'),
  deleteMenuItem
);

module.exports = router;