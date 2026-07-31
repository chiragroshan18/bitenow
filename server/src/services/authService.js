const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const { signAccessToken, signRefreshToken } = require('../utils/token');

const SALT_ROUNDS = 10;

const registerUser = async ({ name, email, password, phone, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, phone, role },
  });

  return sanitizeUser(user);
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const tokenPayload = { id: user.id, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return sanitizeUser(user);
};

// Never return the password hash to the client.
const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

module.exports = { registerUser, loginUser, getUserById };  