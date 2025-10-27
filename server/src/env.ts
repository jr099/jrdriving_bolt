import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  AUTH_COOKIE_NAME: z.string().default('jrdriving_token'),
  AUTH_COOKIE_MAX_AGE: z.coerce.number().default(604800),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const envData = parsed.data;
const localDatabaseUrl = 'mysql://root:secret@localhost:3306/jrdriving';
const databaseUrl = envData.DATABASE_URL?.trim() || (envData.NODE_ENV === 'development' ? localDatabaseUrl : '');

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is required');
  process.exit(1);
}

export const env = {
  ...envData,
  DATABASE_URL: databaseUrl,
};

export const corsOrigins = new Set(env.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean));
