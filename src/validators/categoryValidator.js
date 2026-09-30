// src/validators/categoryValidator.js
const { body } = require('express-validator');

const createCategoryValidation = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
];

module.exports = { createCategoryValidation, updateCategoryValidation };
