import apiClient from './apiClient';

export const getStats = async () => {
  const res = await apiClient.get('/admin/stats');
  return res.data.data;
};

export const getAllUsers = async (page = 1) => {
  const res = await apiClient.get(`/admin/users?page=${page}&limit=20`);
  return res.data.data;
};

export const getAllRestaurantsAdmin = async (page = 1) => {
  const res = await apiClient.get(`/admin/restaurants?page=${page}&limit=20`);
  return res.data.data;
};

export const getAllOrdersAdmin = async (page = 1) => {
  const res = await apiClient.get(`/admin/orders?page=${page}&limit=20`);
  return res.data.data;
};

export const updateUserRole = async (userId, role) => {
  const res = await apiClient.patch(`/admin/users/${userId}/role`, { role });
  return res.data.data;
};