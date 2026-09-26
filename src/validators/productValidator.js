// src/validators/productValidator.js
const { body } = require('express-validator');

const createProductValidation = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('categoryId')
    .isInt()
    .withMessage('categoryId must be an integer'),
];

const updateProductValidation = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('categoryId')
    .optional()
    .isInt()
    .withMessage('categoryId must be an integer'),
];

module.exports = { createProductValidation, updateProductValidation };
