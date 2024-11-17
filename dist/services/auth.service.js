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
exports.key = exports.AuthService = void 0;
const node_rsa_1 = __importDefault(require("node-rsa"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_util_1 = require("../utils/jwt.util");
const users_service_1 = require("../services/users.service");
class AuthService {
    //*********************LOGIN BY EMAIL AND PASSWORD*******************//
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.UsersService.findUserEmail(email);
            if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
                const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, jwt_util_1.JWT_SECRET, {
                    expiresIn: "1h",
                });
                return token;
            }
            return null;
        });
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
