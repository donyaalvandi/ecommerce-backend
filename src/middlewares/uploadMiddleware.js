// src/middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

// =====================
// Helper: اطمینان از وجود پوشه
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
    const uniqueName = `product-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname).toLowerCase()}`;
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
    const uniqueName = `user-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname).toLowerCase()}`;
    cb(null, uniqueName);
  },
});

// =====================
// Filter: فقط عکس
// =====================
const imageFilter = (req, file, cb) => {
  const allowedExt = /jpeg|jpg|png|webp/;
  const allowedMime = /image\/(jpeg|jpg|png|webp)/;

  const extName = allowedExt.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedMime.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  }

  cb(new ApiError(400, 'Only image files (jpg, jpeg, png, webp) are allowed'));
};

// =====================
// محدودیت حجم (۲ مگابایت پیش‌فرض)
// =====================
const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 2 * 1024 * 1024;

// =====================
// Multer instances
// =====================
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
