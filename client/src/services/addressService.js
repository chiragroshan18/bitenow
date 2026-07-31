import apiClient from './apiClient';

export const createAddress = async (data) => {
  const res = await apiClient.post('/addresses', data);
  return res.data.data;
};

export const getMyAddresses = async () => {
  const res = await apiClient.get('/addresses');
  return res.data.data;
};