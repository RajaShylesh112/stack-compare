import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './src/database/schema';
import { config } from 'dotenv';

config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  console.log('Dropping all tables...');
  await db.execute(`
    DROP TABLE IF EXISTS "project_stacks" CASCADE;
    DROP TABLE IF EXISTS "projects" CASCADE;
    DROP TABLE IF EXISTS "user_stacks" CASCADE;
    DROP TABLE IF EXISTS "technology_stacks" CASCADE;
    DROP TABLE IF EXISTS "refresh_tokens" CASCADE;
    DROP TABLE IF EXISTS "users" CASCADE;
    DROP TABLE IF EXISTS "drizzle_migrations" CASCADE;
  `);
  console.log('Finished dropping tables.');
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
