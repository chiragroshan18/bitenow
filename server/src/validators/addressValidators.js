const { z } = require('zod');

const createAddressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

module.exports = { createAddressSchema };