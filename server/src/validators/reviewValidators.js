const { z } = require('zod');

const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be 1-5').max(5, 'Rating must be 1-5'),
  comment: z.string().max(500).optional(),
});

module.exports = { createReviewSchema };