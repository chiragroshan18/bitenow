import apiClient from './apiClient';

export const placeOrder = async (data) => {
  const res = await apiClient.post('/orders', data);
  return res.data.data;
};

export const getOrderById = async (id) => {
  const res = await apiClient.get(`/orders/${id}`);
  return res.data.data;
};

export const getMyOrders = async () => {
  const res = await apiClient.get('/orders');
  return res.data.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await apiClient.patch(`/orders/${id}/status`, { status });
  return res.data.data;
};

// ============== NEW: Order Cancellation ==============

export const cancelOrder = async (id) => {
  const res = await apiClient.patch(`/orders/${id}/cancel`, {});
  return res.data.data;
};