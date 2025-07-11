const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to database');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query test successful:', result);
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✅ Tables in database:', tables);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.message.includes("Can't reach database server")) {
      console.error('\n🔍 Troubleshooting steps:');
      console.error('1. Check if your Supabase project is running (not paused)');
      console.error('2. Verify your DATABASE_URL in .env file');
      console.error('3. Check if your IP is allowlisted in Supabase settings');
      console.error('4. Try connecting with a database client like DBeaver or TablePlus');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
