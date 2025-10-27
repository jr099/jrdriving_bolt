import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import { env } from '../env';

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be provided to connect to the database.');
}

let databaseUrl = env.DATABASE_URL;
if (/planetscale/i.test(databaseUrl) || /\.psdb\.cloud/i.test(databaseUrl)) {
  if (!databaseUrl.includes('sslaccept=')) {
    databaseUrl += databaseUrl.includes('?') ? '&sslaccept=strict' : '?sslaccept=strict';
  }
}

const pool = mysql.createPool(databaseUrl);

export const db = drizzle(pool, { schema });
export type Database = typeof db;
export { schema };
