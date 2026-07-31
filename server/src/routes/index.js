const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authExtendedRoutes');
const restaurantRoutes = require('./restaurantRoutes');
const orderRoutes = require('./orderRoutes');
const adminRoutes = require('./adminRoutes');
const addressRoutes = require('./addressRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const imageRoutes = require('./imageRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/addresses', addressRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/images', imageRoutes);

module.exports = router;