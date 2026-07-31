const { z } = require('zod');

const createRestaurantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL').optional(),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const updateRestaurantSchema = createRestaurantSchema.partial().extend({
  isOpen: z.boolean().optional(),
});

module.exports = { createRestaurantSchema, updateRestaurantSchema };