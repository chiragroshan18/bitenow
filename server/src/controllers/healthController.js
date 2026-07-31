const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const prisma = require('../config/db');

const getHealth = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { timestamp: new Date().toISOString() },
        'Server is running'
      )
    );
});

const getDbHealth = asyncHandler(async (req, res) => {
  const userCount = await prisma.user.count();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { connected: true, userCount },
        'Database connection is healthy'
      )
    );
});

module.exports = { getHealth, getDbHealth };