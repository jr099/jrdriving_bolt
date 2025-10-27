export default () => ({
  PORT: parseInt(process.env.PORT ?? '4000', 10),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'changeme',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME ?? 'jrdriving_session',
  AUTH_COOKIE_MAX_AGE: parseInt(process.env.AUTH_COOKIE_MAX_AGE ?? `${60 * 60 * 24 * 30}`, 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
});
