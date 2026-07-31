const { PrismaClient } = require('@prisma/client');

/**
 * Single shared Prisma Client instance for the whole app.
 * Prevents exhausting the database connection pool from multiple instances.
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;