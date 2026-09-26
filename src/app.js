require('dotenv').config();
const express = require('express');
const path = require('path');

const { notFoundHandler, errorMiddleware } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json({ success: true, data: null, message: 'E-commerce API is running 🚀' });
});

app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
