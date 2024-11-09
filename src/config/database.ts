// src/config/database.ts
import mongoose from 'mongoose';
import { config } from './config';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.DB_URI || "900");
    console.log(`database.js : Vous êtes connectés à MongoDB (${process.env.NODE_ENV} environment)`);
  } catch (err) {
    console.error('database.js : Erreur de connexion à MongoDB', err);
    process.exit(1); 
  }
};
