"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
// src/config/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const connectToDatabase = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.DB_URI || "900");
        console.log(`database.js : Vous êtes connectés à MongoDB (${process.env.NODE_ENV} environment)`);
    }
    catch (err) {
        console.error('database.js : Erreur de connexion à MongoDB', err);
        process.exit(1);
    }
};
exports.connectToDatabase = connectToDatabase;
