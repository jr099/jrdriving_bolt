import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'mysql',
  out: './drizzle',
  schema: './src/database/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'mysql://root:secret@localhost:3306/jrdriving',
  },
});
