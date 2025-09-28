import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

const runMigrate = async () => {
  try {
    console.log('Connecting to database...');
    const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });
    
    console.log('Running migrations...');
    await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
    
    console.log('Migrations completed successfully!');
    await migrationClient.end();
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

runMigrate();
