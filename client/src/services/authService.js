import apiClient from './apiClient';

export const registerUser = async (data) => {
  const res = await apiClient.post('/auth/register', data);
  return res.data.data;
};

export const loginUser = async (data) => {
  const res = await apiClient.post('/auth/login', data);
  return res.data.data;
};

export const getCurrentUser = async () => {
  const res = await apiClient.get('/auth/me');
  return res.data.data;
};

export const logoutUser = async () => {
  await apiClient.post('/auth/logout');
};