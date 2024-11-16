// src/config/config.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  SESSION_SECRET: process.env.SESSION_SECRET || 'default_secret',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  DB_URI_DEV: process.env.DB_URI_DEV || '',
  DB_URI_TEST: process.env.DB_URI_TEST || '',
  DB_URI_PROD: process.env.DB_URI_PROD || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
