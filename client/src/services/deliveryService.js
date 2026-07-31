import apiClient from './apiClient';

export const getAvailableOrders = async () => {
  const res = await apiClient.get('/orders/available');
  return res.data.data;
};

export const assignOrderToMe = async (orderId) => {
  const res = await apiClient.patch(`/orders/${orderId}/assign`, {});
  return res.data.data;
};