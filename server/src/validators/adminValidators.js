const { z } = require('zod');

const updateRoleSchema = z.object({
  role: z.enum(['CUSTOMER', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER', 'ADMIN']),
});

module.exports = { updateRoleSchema };