const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function setupProject() {
  console.log('🔧 Setting up e-commerce project...');
  
  // 1. Clean up .next folder
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    console.log('🧹 Cleaning .next folder...');
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✅ .next folder cleaned');
  }
  
  // 2. Setup database
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // 3. Create admin user if not exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (!adminUser) {
      console.log('👤 Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin'
        }
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // 4. Create demo user if not exists
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    });
    
    if (!demoUser) {
      console.log('👤 Creating demo user...');
      const hashedPassword = await bcrypt.hash('demo123', 10);
      
      await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'demo@example.com',
          password: hashedPassword,
          role: 'user'
        }
      });
      console.log('✅ Demo user created');
    } else {
      console.log('✅ Demo user already exists');
    }
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\nCredentials:');
    console.log('👑 Admin: admin@example.com / admin123');
    console.log('👤 Demo: demo@example.com / demo123');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3000');
    console.log('3. Login at: http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupProject();
