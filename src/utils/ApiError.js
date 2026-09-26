// src/utils/ApiError.js

class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // خطای قابل پیش‌بینی (نه باگ برنامه)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
