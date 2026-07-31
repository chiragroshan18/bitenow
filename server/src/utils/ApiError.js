/**
 * Custom error class thrown anywhere in the app (services, controllers,
 * middlewares) to produce a consistent error response shape.
 */
class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;