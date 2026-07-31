const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const addressService = require('../services/addressService');

const createAddress = asyncHandler(async (req, res) => {
  const address = await addressService.createAddress(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, address, 'Address added'));
});

const getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await addressService.getAddressesForUser(req.user.id);
  return res
    .status(200)
    .json(new ApiResponse(200, addresses, 'Addresses fetched'));
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await addressService.updateAddress(req.params.id, req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, address, 'Address updated'));
});

const deleteAddress = asyncHandler(async (req, res) => {
  await addressService.deleteAddress(req.params.id, req.user.id);
  return res.status(200).json(new ApiResponse(200, null, 'Address deleted'));
});

module.exports = { createAddress, getMyAddresses, updateAddress, deleteAddress };