const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Database Setup Script
 * Runs migrations and seeds the database with initial data
 */

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function runSQLFile(filePath, description) {
  try {
    console.log(`📄 Running ${description}...`);
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ Error running ${description}:`, error.message);
    throw error;
  }
}

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    // Test connection
    console.log('🔗 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // Run migration
    const migrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    await runSQLFile(migrationPath, 'Database Schema Migration');

    // Run seeds
    const seedPath = path.join(__dirname, 'seeds', '001_initial_data.sql');
    await runSQLFile(seedPath, 'Initial Data Seeding');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Test Credentials Created:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('Role: user');
    console.log('\nEmail: admin@example.com');
    console.log('Password: password123');
    console.log('Role: admin');

  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
