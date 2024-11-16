"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// src/config/config.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    PORT: process.env.PORT || 3000,
    SESSION_SECRET: process.env.SESSION_SECRET || 'default_secret',
    JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
    DB_URI_DEV: process.env.DB_URI_DEV || '',
    DB_URI_TEST: process.env.DB_URI_TEST || '',
    DB_URI_PROD: process.env.DB_URI_PROD || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
};
