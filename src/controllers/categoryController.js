// src/controllers/categoryController.js
const { validationResult } = require('express-validator');

const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

// =====================
// Get All Categories
// =====================
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(successResponse(categories, 'Categories fetched successfully'));
});

// =====================
// Get Category By ID
// =====================
const getCategoryById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new ApiError(400, 'Invalid category ID');

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        select: { id: true, name: true, price: true, imageUrl: true },
      },
    },
  });

  if (!category) throw new ApiError(404, 'Category not found');

  res.json(successResponse(category, 'Category fetched successfully'));
});

// =====================
// Create Category (ADMIN)
// =====================
const createCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const { name } = req.body;

  // چک تکراری نبودن اسم
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) throw new ApiError(409, 'Category name already exists');

  const category = await prisma.category.create({
    data: { name },
  });

  res.status(201).json(successResponse(category, 'Category created successfully'));
});

// =====================
// Update Category (ADMIN)
// =====================
const updateCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new ApiError(400, 'Invalid category ID');

  // چک وجود دسته
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Category not found');

  const { name } = req.body;

  // اگه اسم جدید با دسته دیگه‌ای تداخل داره
  if (name && name !== existing.name) {
    const duplicate = await prisma.category.findUnique({ where: { name } });
    if (duplicate) throw new ApiError(409, 'Category name already exists');
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name: name ?? existing.name },
  });

  res.json(successResponse(category, 'Category updated successfully'));
});

// =====================
// Delete Category (ADMIN)
// =====================
const deleteCategory = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new ApiError(400, 'Invalid category ID');

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Category not found');

  await prisma.category.delete({ where: { id } });

  res.json(successResponse(null, 'Category deleted successfully'));
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
