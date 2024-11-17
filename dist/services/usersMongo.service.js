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
exports.UsersMongoService = void 0;
const userMongo_model_1 = __importDefault(require("../models/userMongo.model")); // Assurez-vous que le chemin du modèle est correct
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_util_1 = require("../utils/jwt.util");
class UsersMongoService {
    //*********************CREATE NEW USER*******************//
    static createNewUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Hachage du mot de passe avant de sauvegarder l'utilisateur
                const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
                const newUser = new userMongo_model_1.default(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
                return yield newUser.save();
            }
            catch (error) {
                console.log("Erreur lors de la création de l'utilisateur :", error);
                throw new Error("Erreur lors de la création de l'utilisateur");
            }
        });
    }
    //*********************FIND USER BY EMAIL*******************//
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userMongo_model_1.default.findOne({ email });
            }
            catch (error) {
                console.log("Erreur lors de la recherche de l'utilisateur par email :", error);
                throw new Error("Erreur lors de la recherche de l'utilisateur");
            }
        });
    }
    //*********************GENERATE JWT TOKEN*******************//
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, jwt_util_1.JWT_SECRET, { expiresIn: '1h' });
    }
}
exports.UsersMongoService = UsersMongoService;
