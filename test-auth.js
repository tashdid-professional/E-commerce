const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test user table
    const users = await prisma.user.findMany();
    console.log('✅ User table accessible');
    console.log(`Found ${users.length} users`);
    
    if (users.length > 0) {
      console.log('Sample user:', {
        id: users[0].id,
        email: users[0].email,
        role: users[0].role
      });
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
