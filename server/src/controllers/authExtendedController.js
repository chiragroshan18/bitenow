const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const authService = require('../services/authService');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/token');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = asyncHandler(async (req, res) => {
  await authService.registerUser(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, null, 'Account created successfully.'));
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

  res.cookie('refreshToken', refreshToken, cookieOptions);
  return res
    .status(200)
    .json(new ApiResponse(200, { user, accessToken }, 'Login successful'));
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError(401, 'Refresh token missing');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const accessToken = signAccessToken({ id: decoded.id, role: decoded.role });

  return res
    .status(200)
    .json(new ApiResponse(200, { accessToken }, 'Access token refreshed'));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', cookieOptions);
  return res.status(200).json(new ApiResponse(200, null, 'Logged out'));
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  return res.status(200).json(new ApiResponse(200, user, 'Current user'));
});

module.exports = { register, login, refresh, logout, me };
