"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// src/config/config.ts
const dotenv_1 = __importDefault(require("dotenv"));
// Charger les variables d'environnement à partir du fichier .env
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    sessionSecret: process.env.SESSION_SECRET || "secret_par_defaut_pour_les_sessions",
    jwtSecret: process.env.JWT_SECRET || "secret_par_defaut_pour_le_jwt",
    databaseUrl: process.env.DATABASE_URL || "mongodb://localhost:27017/defaultdb",
    DB_URI: process.env.NODE_ENV === "test" ? process.env.DB_URI_TEST : process.env.DB_URI_PROD,
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
};
