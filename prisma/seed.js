// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // =====================
  // Admin User
  // =====================
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user:', admin.email);

  // =====================
  // Normal User
  // =====================
  const userPassword = await bcrypt.hash('user123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: userPassword,
      name: 'Normal User',
      role: 'USER',
    },
  });
  console.log('✅ Normal user:', user.email);

  // =====================
  // Categories
  // =====================
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { name: 'Electronics' },
  });

  const clothing = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: { name: 'Clothing' },
  });

  const books = await prisma.category.upsert({
    where: { name: 'Books' },
    update: {},
    create: { name: 'Books' },
  });

  console.log('✅ Categories:', electronics.name, clothing.name, books.name);

  // =====================
  // Products
  // =====================
  const product1 = await prisma.product.create({
    data: {
      name: 'iPhone 15',
      description: 'Latest Apple smartphone',
      price: 999.99,
      stock: 10,
      categoryId: electronics.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'T-Shirt',
      description: 'Cotton t-shirt',
      price: 19.99,
      stock: 100,
      categoryId: clothing.id,
    },
  });

  console.log('✅ Products:', product1.name, product2.name);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
