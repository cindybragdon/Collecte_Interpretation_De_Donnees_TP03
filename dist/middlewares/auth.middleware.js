"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_util_1 = require("../utils/jwt.util");
const winston_logger_1 = require("../logger/winston.logger");
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        console.log(req.headers);
        winston_logger_1.logger.error(`STATUS 403 : ${req.method} ${req.url}`);
        res.status(403).json({ message: "Accès refusé. Aucun token fourni." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwt_util_1.JWT_SECRET);
        //console.log(decoded)
        req.body.user = decoded;
        next(); // Next middleware est appellé
    }
    catch (error) {
        winston_logger_1.logger.error(`STATUS 401 : ${req.method} ${req.url}`);
        res.status(401).json({ message: "Token invalide." });
        return;
    }
};
exports.verifyToken = verifyToken;
