"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const express_1 = __importDefault(require("express")); // Ajoute Request et Response
const node_path_1 = require("node:path");
const winston_1 = require("winston");
const app = (0, express_1.default)();
exports.logger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: "./src/logger/app.log" }),
    ],
});
// Fonction middleware avec les bons types
const logAll = function (request, response, next) {
    exports.logger.info(`L'application a démarré : ${request.url}`);
    exports.logger.warn("Attention, ceci est un avertissement");
    exports.logger.error("Une erreur est survenue");
    next();
};
app.use(express_1.default.json());
app.use(express_1.default.static((0, node_path_1.join)(process.cwd(), "src", "public")));
app.use(logAll);
