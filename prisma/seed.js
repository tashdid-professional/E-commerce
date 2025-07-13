import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      }
    });
    
    console.log('✅ Admin user created:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('   Role:', adminUser.role);
  } else {
    console.log('ℹ️  Admin user already exists:');
    console.log('   Email:', adminEmail);
    console.log('   Role:', existingAdmin.role);
  }

  // Create regular test user
  const userEmail = 'user@example.com';
  const userPassword = 'user123';
  
  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    
    const regularUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: userEmail,
        password: hashedPassword,
        role: 'user'
      }
    });
    
    console.log('✅ Test user created:');
    console.log('   Email:', userEmail);
    console.log('   Password:', userPassword);
    console.log('   Role:', regularUser.role);
  } else {
    console.log('ℹ️  Test user already exists:');
    console.log('   Email:', userEmail);
    console.log('   Role:', existingUser.role);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
