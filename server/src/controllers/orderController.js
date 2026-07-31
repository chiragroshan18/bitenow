const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const orderService = require('../services/orderService');

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, order, 'Order placed'));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrdersForUser(req.user.id, req.user.role);
  return res.status(200).json(new ApiResponse(200, orders, 'Orders fetched'));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(
    req.params.id,
    req.user.id,
    req.user.role
  );
  return res.status(200).json(new ApiResponse(200, order, 'Order fetched'));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.user.id,
    req.user.role,
    req.body.status
  );
  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order status updated'));
});

const getAvailableOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAvailableOrdersForDelivery();
  return res
    .status(200)
    .json(new ApiResponse(200, orders, 'Available orders fetched'));
});

const assignOrder = asyncHandler(async (req, res) => {
  const order = await orderService.assignDeliveryPartner(
    req.params.id,
    req.user.id
  );
  return res.status(200).json(new ApiResponse(200, order, 'Order assigned to you'));
});

// ============== NEW: Order Cancellation ==============

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrderByCustomer(req.params.id, req.user.id);
  return res.status(200).json(new ApiResponse(200, order, 'Order cancelled'));
});

// ============== EXPORTS ==============

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAvailableOrders,
  assignOrder,
  cancelOrder,  // ← NEW
};