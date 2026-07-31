import apiClient from './apiClient';

export const getReviewsForRestaurant = async (restaurantId) => {
  const res = await apiClient.get(`/restaurants/${restaurantId}/reviews`);
  return res.data.data;
};

export const createReview = async (orderId, data) => {
  const res = await apiClient.post(`/orders/${orderId}/review`, data);
  return res.data.data;
};