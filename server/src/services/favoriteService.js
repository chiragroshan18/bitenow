const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');

const toggleFavorite = async (userId, restaurantId) => {
  const existing = await prisma.favorite.findUnique({
    where: { userId_restaurantId: { userId, restaurantId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }

  await prisma.favorite.create({ data: { userId, restaurantId } });
  return { favorited: true };
};

const getMyFavorites = async (userId) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { restaurant: true },
    orderBy: { createdAt: 'desc' },
  });
  return favorites.map((f) => f.restaurant);
};

module.exports = { toggleFavorite, getMyFavorites };