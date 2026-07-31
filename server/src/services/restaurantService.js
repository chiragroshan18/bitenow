const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const { geocodeAddress } = require('./geocodingService');

const createRestaurant = async (ownerId, data) => {
  const existing = await prisma.restaurant.findUnique({ where: { ownerId } });
  if (existing) {
    throw new ApiError(409, 'You already have a registered restaurant');
  }

  let { latitude, longitude } = data;
  if (latitude == null || longitude == null) {
    const geocoded = await geocodeAddress(data.address);
    latitude = geocoded.latitude;
    longitude = geocoded.longitude;
  }

  return prisma.restaurant.create({
    data: { ...data, latitude, longitude, ownerId },
  });
};

const getAllRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    // ❌ REMOVED the "where: { isOpen: true }" filter
    // ✅ Now shows ALL restaurants, regardless of isOpen status
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      address: true,
      latitude: true,
      longitude: true,
      isOpen: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
    },
  });

  const ratings = await prisma.review.groupBy({
    by: ['restaurantId'],
    _avg: { rating: true },
    _count: { rating: true },
  });

  const ratingMap = {};
  ratings.forEach((r) => {
    ratingMap[r.restaurantId] = {
      averageRating: r._avg.rating || 0,
      reviewCount: r._count.rating || 0,
    };
  });

  return restaurants.map((r) => ({
    ...r,
    averageRating: ratingMap[r.id]?.averageRating || 0,
    reviewCount: ratingMap[r.id]?.reviewCount || 0,
  }));
};

// ✅ THIS IS THE FIXED VERSION
const getRestaurantById = async (id) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      address: true,
      latitude: true,
      longitude: true,
      isOpen: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
      menuItems: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          isAvailable: true,
          category: true,
          restaurantId: true,
        },
      },
      imageUrl: true,
    },
  });
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }
  return restaurant;
};

const updateRestaurant = async (id, ownerId, data) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }
  if (restaurant.ownerId !== ownerId) {
    throw new ApiError(403, 'You do not own this restaurant');
  }

  return prisma.restaurant.update({ where: { id }, data });
};

const deleteRestaurant = async (id, ownerId) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }
  if (restaurant.ownerId !== ownerId) {
    throw new ApiError(403, 'You do not own this restaurant');
  }

  await prisma.restaurant.delete({ where: { id } });
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};