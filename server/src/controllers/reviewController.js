const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const reviewService = require('../services/reviewService');

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.params.id, req.body);
  return res.status(201).json(new ApiResponse(201, review, 'Review submitted'));
});

const getReviewsForRestaurant = asyncHandler(async (req, res) => {
  const data = await reviewService.getReviewsForRestaurant(req.params.id);
  return res.status(200).json(new ApiResponse(200, data, 'Reviews fetched'));
});

module.exports = { createReview, getReviewsForRestaurant };