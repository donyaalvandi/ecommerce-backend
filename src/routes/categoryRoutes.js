// src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const {
  createCategoryValidation,
  updateCategoryValidation,
} = require('../validators/categoryValidator');

const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post(
  '/',
  protect,
  restrictTo('ADMIN'),
  createCategoryValidation,
  createCategory
);

router.patch(
  '/:id',
  protect,
  restrictTo('ADMIN'),
  updateCategoryValidation,
  updateCategory
);

router.delete('/:id', protect, restrictTo('ADMIN'), deleteCategory);

module.exports = router;
