const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if users exist
    const users = await prisma.user.findMany();
    console.log('📊 Users in database:', users.length);
    
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    
    // Test specific admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (adminUser) {
      console.log('✅ Admin user exists');
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
