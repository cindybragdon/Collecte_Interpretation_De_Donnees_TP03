"use strict";
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
    static async createNewUser(userData) {
        try {
            // Hachage du mot de passe avant de sauvegarder l'utilisateur
            const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
            const newUser = new userMongo_model_1.default({
                ...userData,
                password: hashedPassword,
            });
            return await newUser.save();
        }
        catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error);
            throw new Error("Erreur lors de la création de l'utilisateur");
        }
    }
    //*********************FIND USER BY EMAIL*******************//
    static async findUserByEmail(email) {
        try {
            return await userMongo_model_1.default.findOne({ email });
        }
        catch (error) {
            console.error("Erreur lors de la recherche de l'utilisateur par email :", error);
            throw new Error("Erreur lors de la recherche de l'utilisateur");
        }
    }
    //*********************GENERATE JWT TOKEN*******************//
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, jwt_util_1.JWT_SECRET, { expiresIn: '1h' });
    }
}
exports.UsersMongoService = UsersMongoService;
