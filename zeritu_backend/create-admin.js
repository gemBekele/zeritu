const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@zeritu.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Check if admin exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });
  
  if (existing) {
    console.log('Admin already exists');
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log('Updated existing user to ADMIN');
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Admin User',
        role: 'ADMIN',
        accounts: {
          create: {
            providerId: 'credential',
            accountId: email,
            password: hashedPassword,
          },
        },
      },
    });
    console.log('Admin created:', user.email);
  }
  
  await prisma.$disconnect();
}

createAdmin();
