// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const {
  createProductValidation,
  updateProductValidation,
} = require('../validators/productValidator');

const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { uploadProductImage } = require('../middlewares/uploadMiddleware');

// =====================
// Public Routes
// =====================
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// =====================
// Admin Routes
// =====================
router.post(
  '/',
  protect,
  restrictTo('ADMIN'),
  uploadProductImage.single('image'),
  createProductValidation,
  createProduct
);

router.patch(
  '/:id',
  protect,
  restrictTo('ADMIN'),
  uploadProductImage.single('image'),
  updateProductValidation,
  updateProduct
);

router.delete('/:id', protect, restrictTo('ADMIN'), deleteProduct);

module.exports = router;
