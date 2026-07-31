const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');

const assertOwnership = async (restaurantId, ownerId) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }
  if (restaurant.ownerId !== ownerId) {
    throw new ApiError(403, 'You do not own this restaurant');
  }
  return restaurant;
};

const createMenuItem = async (restaurantId, ownerId, data) => {
  await assertOwnership(restaurantId, ownerId);
  return prisma.menuItem.create({ data: { ...data, restaurantId } });
};

const getMenuItems = async (restaurantId) => {
  return prisma.menuItem.findMany({
    where: { restaurantId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      isAvailable: true,
      category: true,
      restaurantId: true,
    },
  });
};

const getMenuItemById = async (id) => {
  const item = await prisma.menuItem.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      isAvailable: true,
      category: true,
      restaurantId: true,
    },
  });
  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }
  return item;
};

const updateMenuItem = async (id, ownerId, data) => {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }
  await assertOwnership(item.restaurantId, ownerId);

  return prisma.menuItem.update({ where: { id }, data });
};

const deleteMenuItem = async (id, ownerId) => {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }
  await assertOwnership(item.restaurantId, ownerId);

  await prisma.menuItem.delete({ where: { id } });
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};