require('dotenv').config();

console.log('🔍 Environment Variables Check:');
console.log('================================');

// Check DATABASE_URL
if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL is set');
  console.log('Length:', process.env.DATABASE_URL.length);
  console.log('Starts with postgresql://', process.env.DATABASE_URL.startsWith('postgresql://'));
  console.log('First 50 chars:', process.env.DATABASE_URL.substring(0, 50) + '...');
  
  // Check if it contains neon
  if (process.env.DATABASE_URL.includes('neon.tech')) {
    console.log('✅ Using Neon database');
  } else {
    console.log('⚠️  Not using Neon database');
  }
} else {
  console.log('❌ DATABASE_URL is NOT set');
}

// Check JWT_SECRET
if (process.env.JWT_SECRET) {
  console.log('✅ JWT_SECRET is set');
} else {
  console.log('❌ JWT_SECRET is NOT set');
}

console.log('\n📁 Current working directory:', process.cwd());
console.log('📄 .env file exists:', require('fs').existsSync('.env'));

if (require('fs').existsSync('.env')) {
  const envContent = require('fs').readFileSync('.env', 'utf8');
  console.log('\n📄 .env file content preview:');
  console.log(envContent.substring(0, 100) + '...');
}
