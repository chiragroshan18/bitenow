const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/token');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Access token missing'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired access token'));
  }
};

/**
 * Restricts a route to specific roles.
 * Usage: authenticate, authorize('ADMIN', 'RESTAURANT_OWNER')
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to do this'));
  }
  next();
};

module.exports = { authenticate, authorize };