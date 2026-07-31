import apiClient from './apiClient';

export const getMyFavorites = async () => {
  const res = await apiClient.get('/favorites');
  return res.data.data;
};

export const toggleFavorite = async (restaurantId) => {
  const res = await apiClient.post(`/favorites/${restaurantId}/toggle`, {});
  return res.data.data;
};