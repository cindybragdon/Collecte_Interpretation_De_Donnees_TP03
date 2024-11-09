"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.key = exports.AuthService = void 0;
const node_rsa_1 = __importDefault(require("node-rsa"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_util_1 = require("../utils/jwt.util");
const users_service_1 = require("../services/users.service");
class AuthService {
    //*********************LOGIN BY EMAIL AND PASSWORD*******************//
    static async login(email, password) {
        const user = await users_service_1.UsersService.findUserEmail(email);
        if (user && (await bcryptjs_1.default.compare(password, user.password))) {
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, jwt_util_1.JWT_SECRET, {
                expiresIn: "1h",
            });
            return token;
        }
        return null;
    }
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, jwt_util_1.JWT_SECRET);
    }
}
exports.AuthService = AuthService;
const key = new node_rsa_1.default({ b: 512 });
exports.key = key;
const publicKey = key.exportKey("public");
const privateKey = key.exportKey("private");
