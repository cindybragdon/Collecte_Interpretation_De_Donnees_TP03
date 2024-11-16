// src/config/database.ts
import mongoose from 'mongoose';
import { config } from './config';

export const connectToDatabase = async (): Promise<void> => {
  try {
    const dbUri = config.NODE_ENV === 'production'
      ? config.DB_URI_PROD
      : config.NODE_ENV === 'test'
      ? config.DB_URI_TEST
      : config.DB_URI_DEV;

    // Connexion sans les options dépréciées
    await mongoose.connect(dbUri);

    console.log(`Connected to MongoDB in ${process.env.NODE_ENV} environment`);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Terminer l'application si la connexion échoue
  }
};
