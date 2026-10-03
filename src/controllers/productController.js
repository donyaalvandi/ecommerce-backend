// src/controllers/productController.js
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

// =====================
// Helper: حذف فایل قدیمی از disk
// =====================
const deleteOldFile = (imageUrl) => {
  if (!imageUrl) return;

  // imageUrl مثلاً: /uploads/products/product-123.jpg
  const filename = path.basename(imageUrl);
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
    'products',
    filename
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Deleted old file: ${filename}`);
  }
};

// =====================
// Get All Products (Public، با filter/search)
// =====================
const getAllProducts = asyncHandler(async (req, res) => {
  const { categoryId, search, minPrice, maxPrice } = req.query;

  const where = {};

  if (categoryId) {
    const catId = parseInt(categoryId);
    if (isNaN(catId)) throw new ApiError(400, 'categoryId must be a number');
    where.categoryId = catId;
  }

  if (search) {
    where.name = { contains: search };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (isNaN(min)) throw new ApiError(400, 'minPrice must be a number');
      where.price.gte = min;
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (isNaN(max)) throw new ApiError(400, 'maxPrice must be a number');
      where.price.lte = max;
    }
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(successResponse(products, 'Products fetched successfully'));
});

// =====================
// Get Product By ID (Public)
// =====================
const getProductById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new ApiError(400, 'Invalid product ID');

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
    },
  });

  if (!product) throw new ApiError(404, 'Product not found');

  res.json(successResponse(product, 'Product fetched successfully'));
});

// =====================
// Create Product (ADMIN)
// =====================
const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const { name, description, price, stock, categoryId } = req.body;

  // چک وجود دسته‌بندی
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
  });
  if (!category) throw new ApiError(404, 'Category not found');

  // آدرس عکس
  const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      price: parseFloat(price),
      stock: stock ? parseInt(stock) : 0,
      categoryId: parseInt(categoryId),
      imageUrl,
    },
    include: {
      category: { select: { id: true, name: true } },
    },
  });

  res.status(201).json(successResponse(product, 'Product created successfully'));
});

// =====================
// Update Product (ADMIN)
// =====================
const updateProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation failed', errors.array());
  }

  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new ApiError(400, 'Invalid product ID');

  // چک وجود محصول
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Product not found');

  const { name, description, price, stock, categoryId } = req.body;
  const data = {};

  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = parseFloat(price);
  if (stock !== undefined) data.stock = parseInt(stock);

  if (categoryId !== undefined) {
    const cat = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });
    if (!cat) throw new ApiError(404, 'Category not found');
    data.categoryId = parseInt(categoryId);
  }

  // اگه فایل جدید آپلود شد، فایل قدیمی رو پاک کن
  if (req.file) {
    deleteOldFile(existing.imageUrl);
    data.imageUrl = `/uploads/products/${req.file.filename}`;
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    include: {
      category: { select: { id: true, name: true } },
    },
  });

  res.json(successResponse(product, 'Product updated successfully'));
});

// =====================
// Delete Product (ADMIN)
// =====================
const deleteProduct = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new ApiError(400, 'Invalid product ID');

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Product not found');

  // پاک کردن عکس از disk
  deleteOldFile(existing.imageUrl);

  await prisma.product.delete({ where: { id } });

  res.json(successResponse(null, 'Product deleted successfully'));
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
