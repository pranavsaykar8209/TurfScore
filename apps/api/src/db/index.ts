import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';

// 1. Load environment variables (e.g. from .env file)
dotenv.config();

// 2. Ensure that the database connection string is available
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is missing in the environment variables');
}

// 3. Initialize the PostgreSQL connection client
// 'prepare: false' is recommended for Supabase when using the connection pooler (PgBouncer)
const client = postgres(connectionString, { prepare: false });

// 4. Initialize and export the Drizzle ORM database instance
// This 'db' instance will be used across the application to execute queries
export const db = drizzle(client, { schema });
