const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const restaurantService = require('../services/restaurantService');

const createRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.createRestaurant(
    req.user.id,
    req.body
  );
  return res
    .status(201)
    .json(new ApiResponse(201, restaurant, 'Restaurant created'));
});

const getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await restaurantService.getAllRestaurants();
  return res
    .status(200)
    .json(new ApiResponse(200, restaurants, 'Restaurants fetched'));
});

const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, restaurant, 'Restaurant fetched'));
});

const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.updateRestaurant(
    req.params.id,
    req.user.id,
    req.body
  );
  return res
    .status(200)
    .json(new ApiResponse(200, restaurant, 'Restaurant updated'));
});

const deleteRestaurant = asyncHandler(async (req, res) => {
  await restaurantService.deleteRestaurant(req.params.id, req.user.id);
  return res.status(200).json(new ApiResponse(200, null, 'Restaurant deleted'));
});

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};