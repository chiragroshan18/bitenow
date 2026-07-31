const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const menuItemService = require('../services/menuItemService');

const createMenuItem = asyncHandler(async (req, res) => {
  const item = await menuItemService.createMenuItem(
    req.params.restaurantId,
    req.user.id,
    req.body
  );
  return res.status(201).json(new ApiResponse(201, item, 'Menu item created'));
});

const getMenuItems = asyncHandler(async (req, res) => {
  const items = await menuItemService.getMenuItems(req.params.restaurantId);
  return res.status(200).json(new ApiResponse(200, items, 'Menu items fetched'));
});

const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await menuItemService.getMenuItemById(req.params.itemId);
  return res.status(200).json(new ApiResponse(200, item, 'Menu item fetched'));
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await menuItemService.updateMenuItem(
    req.params.itemId,
    req.user.id,
    req.body
  );
  return res.status(200).json(new ApiResponse(200, item, 'Menu item updated'));
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  await menuItemService.deleteMenuItem(req.params.itemId, req.user.id);
  return res.status(200).json(new ApiResponse(200, null, 'Menu item deleted'));
});

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};