"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
// src/config/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbUri = config_1.config.NODE_ENV === 'production'
            ? config_1.config.DB_URI_PROD
            : config_1.config.NODE_ENV === 'test'
                ? config_1.config.DB_URI_TEST
                : config_1.config.DB_URI_DEV;
        // Connexion sans les options dépréciées
        yield mongoose_1.default.connect(dbUri);
        console.log(`Connected to MongoDB in ${process.env.NODE_ENV} environment`);
    }
    catch (err) {
        console.error('Database connection error:', err);
        process.exit(1); // Terminer l'application si la connexion échoue
    }
});
exports.connectToDatabase = connectToDatabase;
