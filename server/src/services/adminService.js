const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');

const getAllUsers = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      }, // password excluded explicitly, never selected
    }),
    prisma.user.count(),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getAllRestaurants = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { name: true, email: true } } },
    }),
    prisma.restaurant.count(),
  ]);

  return { restaurants, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getAllOrders = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, email: true } },
        restaurant: { select: { name: true } },
      },
    }),
    prisma.order.count(),
  ]);

  return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getStats = async () => {
  const [userCount, restaurantCount, orderCount, revenueResult, ordersByStatus] =
    await Promise.all([
      prisma.user.count(),
      prisma.restaurant.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'DELIVERED' },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

  const statusBreakdown = ordersByStatus.reduce((acc, row) => {
    acc[row.status] = row._count.status;
    return acc;
  }, {});

  return {
    totalUsers: userCount,
    totalRestaurants: restaurantCount,
    totalOrders: orderCount,
    totalRevenue: revenueResult._sum.totalAmount || 0,
    ordersByStatus: statusBreakdown,
  };
};

const updateUserRole = async (userId, newRole) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: { id: true, name: true, email: true, role: true },
  });

  return updated;
};

module.exports = {
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  getStats,
  updateUserRole,
};