const { z } = require('zod');

const createMenuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  imageUrl: z.string().url('Must be a valid URL').optional(),
  category: z.string().min(2, 'Category is required'),
  isAvailable: z.boolean().optional(),
});

const updateMenuItemSchema = createMenuItemSchema.partial();

module.exports = { createMenuItemSchema, updateMenuItemSchema };