// src/app.js
require('dotenv').config();
const express = require('express');
const path = require('path');

const { notFoundHandler, errorMiddleware } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// =====================
// Global Middlewares
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// Static Files
// =====================
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// =====================
// Health Check
// =====================
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'E-commerce API is running 🚀',
  });
});

// =====================
// Routes
// =====================
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// =====================
// Error Handling (باید آخر باشه)
// =====================
app.use(notFoundHandler);
app.use(errorMiddleware);

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
