const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const { geocodeAddress } = require('./geocodingService');

const createAddress = async (userId, data) => {
  let { latitude, longitude } = data;

  if (latitude == null || longitude == null) {
    const fullAddress = [data.street, data.city, data.state, data.postalCode]
      .filter(Boolean)
      .join(', ');
    const geocoded = await geocodeAddress(fullAddress);
    latitude = geocoded.latitude;
    longitude = geocoded.longitude;
  }

  return prisma.address.create({
    data: { ...data, latitude, longitude, userId },
  });
};

const updateAddress = async (id, userId, data) => {
  const existingAddress = await prisma.address.findUnique({ where: { id } });
  if (!existingAddress) throw new ApiError(404, 'Address not found');
  if (existingAddress.userId !== userId) throw new ApiError(403, 'Not your address');

  let { latitude, longitude } = data;
  const shouldGeocode = latitude == null || longitude == null;

  if (shouldGeocode) {
    const fullAddress = [data.street ?? existingAddress.street, data.city ?? existingAddress.city, data.state ?? existingAddress.state, data.postalCode ?? existingAddress.postalCode]
      .filter(Boolean)
      .join(', ');
    const geocoded = await geocodeAddress(fullAddress);
    latitude = geocoded.latitude;
    longitude = geocoded.longitude;
  }

  return prisma.address.update({
    where: { id },
    data: { ...data, latitude, longitude },
  });
};

const getAddressesForUser = async (userId) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' },
  });
};

const deleteAddress = async (id, userId) => {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) throw new ApiError(404, 'Address not found');
  if (address.userId !== userId) throw new ApiError(403, 'Not your address');

  await prisma.address.delete({ where: { id } });
};

module.exports = { createAddress, getAddressesForUser, deleteAddress };