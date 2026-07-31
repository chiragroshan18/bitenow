import apiClient from './apiClient';

export const uploadRestaurantImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await apiClient.post('/images/restaurant', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};

export const uploadMenuItemImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await apiClient.post('/images/menu-item', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};