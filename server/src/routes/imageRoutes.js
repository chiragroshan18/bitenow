const express = require('express');
const upload = require('../config/multer');
const {
  uploadRestaurantImage,
  uploadMenuItemImage,
} = require('../controllers/imageController');
const { authenticate, authorize } = require('../middlewares/authenticate');

const router = express.Router();

// All image uploads require authentication and owner role
router.use(authenticate, authorize('RESTAURANT_OWNER'));

router.post('/restaurant', upload.single('image'), uploadRestaurantImage);
router.post('/menu-item', upload.single('image'), uploadMenuItemImage);

module.exports = router;