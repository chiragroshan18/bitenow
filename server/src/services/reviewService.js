const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');

const createReview = async (customerId, orderId, { rating, comment }) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.customerId !== customerId) throw new ApiError(403, 'Not your order');
  if (order.status !== 'DELIVERED') {
    throw new ApiError(400, 'You can only review delivered orders');
  }

  const existing = await prisma.review.findUnique({ where: { orderId } });
  if (existing) throw new ApiError(409, 'You already reviewed this order');

  return prisma.review.create({
    data: { rating, comment, customerId, restaurantId: order.restaurantId, orderId },
  });
};

const getReviewsForRestaurant = async (restaurantId) => {
  const reviews = await prisma.review.findMany({
    where: { restaurantId },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const agg = await prisma.review.aggregate({
    where: { restaurantId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    reviews,
    averageRating: agg._avg.rating || 0,
    reviewCount: agg._count.rating,
  };
};

module.exports = { createReview, getReviewsForRestaurant };