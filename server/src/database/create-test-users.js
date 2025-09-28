const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function createTestUsers() {
  try {
    console.log('🔗 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // Hash the password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('🔐 Password hashed successfully');

    // Create test users
    const insertUserQuery = `
      INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active, email_verified) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8),
        ($9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW()
    `;

    await pool.query(insertUserQuery, [
      '550e8400-e29b-41d4-a716-446655440000',
      'test@example.com',
      hashedPassword,
      'user',
      'Test',
      'User',
      true,
      true,
      '550e8400-e29b-41d4-a716-446655440001',
      'admin@example.com',
      hashedPassword,
      'admin',
      'Admin',
      'User',
      true,
      true
    ]);

    console.log('✅ Test users created/updated successfully\n');
    
    // Verify users exist
    const verifyQuery = 'SELECT id, email, role, first_name, last_name FROM users WHERE email IN ($1, $2)';
    const result = await pool.query(verifyQuery, ['test@example.com', 'admin@example.com']);
    
    console.log('📋 Created Users:');
    result.rows.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.first_name} ${user.last_name}`);
    });

    console.log('\n🎉 Test users setup completed!');
    console.log('\n🔑 Test Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('\nEmail: admin@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Error creating test users:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createTestUsers();
