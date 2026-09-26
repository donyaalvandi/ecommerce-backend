// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};


const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

// =====================
// Register
// =====================
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const { email, password, name } = req.body;

  // چک تکراری نبودن ایمیل
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // ساخت کاربر
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  // ساخت توکن
  const token = signToken(user);

  res.status(201).json(
    successResponse(
      { user: sanitizeUser(user), token },
      'User registered successfully'
    )
  );
});

// =====================
// Login
// =====================
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const { email, password } = req.body;

  // پیدا کردن کاربر
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // چک پسورد
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // ساخت توکن
  const token = signToken(user);

  res.json(
    successResponse(
      { user: sanitizeUser(user), token },
      'Logged in successfully'
    )
  );
});

// =====================
// Get Me
// =====================
const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { images: true },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(successResponse(sanitizeUser(user), 'User fetched successfully'));
});

module.exports = { register, login, getMe };
