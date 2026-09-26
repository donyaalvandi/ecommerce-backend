// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// =====================
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // چک کردن Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authenticated. Please log in.');
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // چک کردن کاربر
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  // attach user به request
  req.user = { id: user.id, role: user.role, email: user.email };
  next();
});

// =====================

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authenticated'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to do this'));
    }
    next();
  };
};

module.exports = { protect, restrictTo };
