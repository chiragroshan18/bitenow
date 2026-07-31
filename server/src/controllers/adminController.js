const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const adminService = require('../services/adminService');

const parsePagination = (req) => ({
  page: parseInt(req.query.page) || 1,
  limit: parseInt(req.query.limit) || 20,
});

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getAllUsers(parsePagination(req));
  return res.status(200).json(new ApiResponse(200, result, 'Users fetched'));
});

const getAllRestaurants = asyncHandler(async (req, res) => {
  const result = await adminService.getAllRestaurants(parsePagination(req));
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Restaurants fetched'));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const result = await adminService.getAllOrders(parsePagination(req));
  return res.status(200).json(new ApiResponse(200, result, 'Orders fetched'));
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getStats();
  return res.status(200).json(new ApiResponse(200, stats, 'Stats fetched'));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserRole(req.params.id, req.body.role);
  return res.status(200).json(new ApiResponse(200, user, 'User role updated'));
});

module.exports = {
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  getStats,
  updateUserRole,
};