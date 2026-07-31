import apiClient from './apiClient';

export const getMenuItems = async (restaurantId) => {
  const res = await apiClient.get(`/restaurants/${restaurantId}/menu-items`);
  return res.data.data;
};

export const createMenuItem = async (restaurantId, data) => {
  const res = await apiClient.post(
    `/restaurants/${restaurantId}/menu-items`,
    data
  );
  return res.data.data;
};

export const updateMenuItem = async (restaurantId, itemId, data) => {
  const res = await apiClient.patch(
    `/restaurants/${restaurantId}/menu-items/${itemId}`,
    data
  );
  return res.data.data;
};

export const deleteMenuItem = async (restaurantId, itemId) => {
  await apiClient.delete(`/restaurants/${restaurantId}/menu-items/${itemId}`);
};