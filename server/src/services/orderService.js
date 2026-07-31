const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const { getIO } = require('../sockets/socketManager');

// Defines which status can legally move to which next status.
const VALID_TRANSITIONS = {
  PLACED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

const createOrder = async (customerId, { addressId, items }) => {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== customerId) {
    throw new ApiError(400, 'Invalid delivery address');
  }

  const menuItemIds = items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
  });

  if (menuItems.length !== menuItemIds.length) {
    throw new ApiError(400, 'One or more menu items do not exist');
  }

  const restaurantIds = new Set(menuItems.map((mi) => mi.restaurantId));
  if (restaurantIds.size > 1) {
    throw new ApiError(400, 'All items in an order must be from the same restaurant');
  }
  const restaurantId = [...restaurantIds][0];

  const unavailable = menuItems.filter((mi) => !mi.isAvailable);
  if (unavailable.length > 0) {
    throw new ApiError(
      400,
      `Unavailable item(s): ${unavailable.map((mi) => mi.name).join(', ')}`
    );
  }

  // Build OrderItem rows using the DB's real price, never the client's.
  const orderItemsData = items.map((item) => {
    const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
    return {
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      priceAtOrder: menuItem.price,
    };
  });

  const totalAmount = orderItemsData.reduce(
    (sum, item) => sum + item.priceAtOrder * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      customerId,
      restaurantId,
      addressId,
      totalAmount,
      items: { create: orderItemsData },
    },
    include: { items: { include: { menuItem: true } }, restaurant: true },
  });

  return order;
};

const getOrdersForUser = async (userId, role) => {
  if (role === 'DELIVERY_PARTNER') {
    return prisma.order.findMany({
      where: { deliveryPartnerId: userId },
      include: {
        items: { include: { menuItem: true } },
        restaurant: true,
        customer: true,
        deliveryAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  if (role === 'RESTAURANT_OWNER') {
    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: userId },
    });
    if (!restaurant) return [];

    return prisma.order.findMany({
      where: { restaurantId: restaurant.id },
      include: { items: { include: { menuItem: true } }, customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Default: CUSTOMER sees their own orders.
  return prisma.order.findMany({
    where: { customerId: userId },
    include: { items: { include: { menuItem: true } }, restaurant: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getOrderById = async (orderId, userId, role) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { menuItem: true } },
      restaurant: true,
      customer: true,
      deliveryAddress: true,
    },
  });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const isOwnerOfOrder = order.customerId === userId;
  const isRestaurantOwner =
    role === 'RESTAURANT_OWNER' && order.restaurant.ownerId === userId;

  if (!isOwnerOfOrder && !isRestaurantOwner) {
    throw new ApiError(403, 'You do not have access to this order');
  }

  return order;
};

const updateOrderStatus = async (orderId, userId, role, newStatus) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { restaurant: true },
  });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const isRestaurantOwner =
    role === 'RESTAURANT_OWNER' && order.restaurant.ownerId === userId;
  const isAssignedDeliveryPartner =
    role === 'DELIVERY_PARTNER' && order.deliveryPartnerId === userId;

  if (!isRestaurantOwner && !isAssignedDeliveryPartner) {
    throw new ApiError(403, 'You do not have permission to update this order');
  }

  // Delivery partners may only mark an order as DELIVERED, nothing else.
  if (isAssignedDeliveryPartner && newStatus !== 'DELIVERED') {
    throw new ApiError(403, 'Delivery partners can only mark orders as delivered');
  }

  const allowedNext = VALID_TRANSITIONS[order.status] || [];
  if (!allowedNext.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot transition order from ${order.status} to ${newStatus}`
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  getIO()
    .to(`order:${orderId}`)
    .emit('order:statusUpdated', {
      orderId: updatedOrder.id,
      status: updatedOrder.status,
      updatedAt: updatedOrder.updatedAt,
    });

  return updatedOrder;
};

const getAvailableOrdersForDelivery = async () => {
  return prisma.order.findMany({
    where: { status: 'READY_FOR_PICKUP', deliveryPartnerId: null },
    include: { restaurant: true, items: { include: { menuItem: true } } },
    orderBy: { createdAt: 'asc' },
  });
};

const assignDeliveryPartner = async (orderId, deliveryPartnerId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  if (order.status !== 'READY_FOR_PICKUP') {
    throw new ApiError(400, 'Order is not ready for pickup');
  }
  if (order.deliveryPartnerId) {
    throw new ApiError(409, 'Order already assigned to a delivery partner');
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { deliveryPartnerId, status: 'OUT_FOR_DELIVERY' },
  });

  getIO()
    .to(`order:${orderId}`)
    .emit('order:statusUpdated', {
      orderId: updatedOrder.id,
      status: updatedOrder.status,
      updatedAt: updatedOrder.updatedAt,
    });

  return updatedOrder;
};

// ============== NEW: Order Cancellation ==============

const cancelOrderByCustomer = async (orderId, customerId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.customerId !== customerId) throw new ApiError(403, 'Not your order');
  if (!['PLACED', 'ACCEPTED'].includes(order.status)) {
    throw new ApiError(400, 'This order can no longer be cancelled');
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
  });

  getIO()
    .to(`order:${orderId}`)
    .emit('order:statusUpdated', {
      orderId: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    });

  return updated;
};

// ============== EXPORTS ==============

module.exports = {
  createOrder,
  getOrdersForUser,
  getOrderById,
  updateOrderStatus,
  getAvailableOrdersForDelivery,
  assignDeliveryPartner,
  cancelOrderByCustomer,  // ← NEW
};