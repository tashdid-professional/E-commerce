// Test different connection formats
const { PrismaClient } = require('@prisma/client');

async function testDifferentConnections() {
  const currentUrl = process.env.DATABASE_URL;
  console.log('Current DATABASE_URL:', currentUrl);
  
  // Test current connection
  console.log('\n1. Testing current connection...');
  const prisma1 = new PrismaClient();
  try {
    await prisma1.$connect();
    console.log('✅ Current connection works!');
    await prisma1.$disconnect();
    return;
  } catch (error) {
    console.log('❌ Current connection failed:', error.message);
    await prisma1.$disconnect();
  }
  
  // Try alternative port (6543 for pooled connections)
  console.log('\n2. Testing with pooled connection (port 6543)...');
  const pooledUrl = currentUrl.replace(':5432', ':6543');
  console.log('Trying:', pooledUrl);
  
  const prisma2 = new PrismaClient({
    datasources: {
      db: {
        url: pooledUrl
      }
    }
  });
  
  try {
    await prisma2.$connect();
    console.log('✅ Pooled connection works!');
    console.log('👉 Update your .env file to use port 6543');
    await prisma2.$disconnect();
    return;
  } catch (error) {
    console.log('❌ Pooled connection failed:', error.message);
    await prisma2.$disconnect();
  }
  
  console.log('\n🔍 Next steps:');
  console.log('1. Check if your Supabase project is running (not paused)');
  console.log('2. Go to Supabase Dashboard → Project Settings → Database');
  console.log('3. Copy the correct connection string');
  console.log('4. Make sure your IP is not blocked');
}

testDifferentConnections();
