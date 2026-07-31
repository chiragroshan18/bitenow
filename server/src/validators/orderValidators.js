const { z } = require('zod');

const createOrderSchema = z.object({
  addressId: z.string().uuid('Invalid address ID'),
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid('Invalid menu item ID'),
        quantity: z.number().int().positive('Quantity must be at least 1'),
      })
    )
    .min(1, 'Order must contain at least one item'),
});

const updateOrderStatusSchema = z.object({
  status: z.enum([
    'ACCEPTED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };