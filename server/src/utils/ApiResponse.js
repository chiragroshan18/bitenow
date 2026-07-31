/**
 * Standard success response shape used by every controller,
 * so the frontend always receives a predictable structure:
 * { success, statusCode, data, message }
 */
class ApiResponse {
  constructor(statusCode, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

module.exports = ApiResponse;