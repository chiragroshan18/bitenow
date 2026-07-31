const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { uploadImage, deleteImage } = require('../services/imageService');

const uploadRestaurantImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }
  const result = await uploadImage(req.file.buffer, 'bite-now/restaurants');
  return res.status(200).json(new ApiResponse(200, result, 'Image uploaded successfully'));
});

const uploadMenuItemImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }
  const result = await uploadImage(req.file.buffer, 'bite-now/menu-items');
  return res.status(200).json(new ApiResponse(200, result, 'Image uploaded successfully'));
});

module.exports = { uploadRestaurantImage, uploadMenuItemImage };