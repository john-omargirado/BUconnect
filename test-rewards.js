// Simple test script to debug rewards functionality
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testRewards() {
  console.log('Testing rewards functionality...\n');

  try {
    // Test 1: Check if tables exist
    console.log('1. Checking database tables...');
    
    const users = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users LIMIT 1`;
    console.log('✓ Users table accessible:', users);

    const purchases = await prisma.$queryRaw`SELECT COUNT(*) as count FROM purchases LIMIT 1`;
    console.log('✓ Purchases table accessible:', purchases);

    const tokens = await prisma.$queryRaw`SELECT COUNT(*) as count FROM token_transactions LIMIT 1`;
    console.log('✓ Token_transactions table accessible:', tokens);

    // Test 2: Check user with tokens
    console.log('\n2. Checking users with Connect Tokens...');
    const usersWithTokens = await prisma.$queryRaw`
      SELECT id, name, email, connectTokens 
      FROM users 
      WHERE connectTokens > 0 
      LIMIT 5
    `;
    console.log('Users with tokens:', usersWithTokens);

    // Test 3: Check recent purchases
    console.log('\n3. Checking recent purchases...');
    const recentPurchases = await prisma.$queryRaw`
      SELECT p.*, u.name as userName 
      FROM purchases p 
      JOIN users u ON p.userId = u.id 
      ORDER BY p.createdAt DESC 
      LIMIT 5
    `;
    console.log('Recent purchases:', recentPurchases);

    // Test 4: Check reward items
    console.log('\n4. Testing reward items structure...');
    const sampleItem = {
      id: "test_item",
      name: "Test Item",
      price: 50,
      config: JSON.stringify({ test: true })
    };
    console.log('Sample reward item structure:', sampleItem);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRewards();
