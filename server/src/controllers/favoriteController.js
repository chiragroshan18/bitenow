const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const favoriteService = require('../services/favoriteService');

const toggleFavorite = asyncHandler(async (req, res) => {
  const result = await favoriteService.toggleFavorite(req.user.id, req.params.id);
  return res.status(200).json(new ApiResponse(200, result, 'Favorite updated'));
});

const getMyFavorites = asyncHandler(async (req, res) => {
  const favorites = await favoriteService.getMyFavorites(req.user.id);
  return res.status(200).json(new ApiResponse(200, favorites, 'Favorites fetched'));
});

module.exports = { toggleFavorite, getMyFavorites };