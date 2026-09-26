// src/middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

// =====================
// اطمینان از وجود پوشه‌ها
// =====================
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// =====================
// Storage برای Product
// =====================
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', '..', 'uploads', 'products');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// =====================
// Storage برای User
// =====================
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', '..', 'uploads', 'users');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `user-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// =====================
// Filter: فقط عکس
// =====================
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    return cb(null, true);
  }
  cb(new ApiError(400, 'Only image files (jpg, jpeg, png, webp) are allowed'));
};

const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 2 * 1024 * 1024;

const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits: { fileSize: maxSize },
});

const uploadUserImage = multer({
  storage: userStorage,
  fileFilter: imageFilter,
  limits: { fileSize: maxSize },
});

module.exports = { uploadProductImage, uploadUserImage };
