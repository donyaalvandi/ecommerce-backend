// src/app.js
require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'E-commerce API is running 🚀',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
// src/app.js (موقتاً اضافه کن)
const prisma = require('./config/prisma');

async function testConnection() {
  const userCount = await prisma.user.count();
  console.log(`✅ Database connected. Users: ${userCount}`);
}

testConnection().catch(console.error);
