const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function quickTest() {
  const prisma = new PrismaClient();
  
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Try to find admin user
    const user = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (user) {
      console.log('✅ Admin user found');
      
      // Test password
      const isValid = await bcrypt.compare('admin123', user.password);
      console.log('✅ Password test:', isValid ? 'PASSED' : 'FAILED');
    } else {
      console.log('❌ Admin user not found - creating...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newUser = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin'
        }
      });
      console.log('✅ Admin user created:', newUser.email);
    }
    
    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickTest();
