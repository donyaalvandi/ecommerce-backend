// src/middlewares/errorMiddleware.js
const ApiError = require('../utils/ApiError');
const { errorResponse } = require('../utils/response');

// =====================
// 404 Handler
// =====================
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

// =====================
// Error Handler
// =====================
const errorMiddleware = (err, req, res, next) => {

  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // =====================
  // Prisma Errors
  // =====================
  if (err.code) {
    switch (err.code) {
      // Unique constraint violation
      case 'P2002':
        statusCode = 409;
        const target = err.meta?.target;
        message = `Duplicate value for field(s): ${
          Array.isArray(target) ? target.join(', ') : target
        }`;
        break;

      // Record not found
      case 'P2025':
        statusCode = 404;
        message = err.meta?.cause || 'Record not found';
        break;

      // Foreign key constraint failed
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint failed';
        break;

      // Value too long
      case 'P2000':
        statusCode = 400;
        message = 'Value too long for the column';
        break;

      default:

        if (err.code.startsWith('P')) {
          statusCode = 500;
          message = 'Database error';
        }
    }
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    } else {
      message = err.message;
    }
  }

  if (process.env.NODE_ENV !== 'production' || statusCode >= 500) {
    console.error('❌ Error:', {
      statusCode,
      message,
      code: err.code,
      path: req.originalUrl,
      method: req.method,
    });
  }


  res.status(statusCode).json(errorResponse(message, details));
};

module.exports = { notFoundHandler, errorMiddleware };
