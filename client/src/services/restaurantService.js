import apiClient from './apiClient';

export const getAllRestaurants = async () => {
  const res = await apiClient.get('/restaurants');
  return res.data.data;
};

export const getRestaurantById = async (id) => {
  const res = await apiClient.get(`/restaurants/${id}`);
  return res.data.data;
};

export const createRestaurant = async (data) => {
  const res = await apiClient.post('/restaurants', data);
  return res.data.data;
};

export const updateRestaurant = async (id, data) => {
  const res = await apiClient.patch(`/restaurants/${id}`, data);
  return res.data.data;
};