const express = require('express');
const { toggleFavorite, getMyFavorites } = require('../controllers/favoriteController');
const { authenticate, authorize } = require('../middlewares/authenticate');

const router = express.Router();
router.use(authenticate, authorize('CUSTOMER'));

router.get('/', getMyFavorites);
router.post('/:id/toggle', toggleFavorite);

module.exports = router;