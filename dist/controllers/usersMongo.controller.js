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
exports.UserMongoController = void 0;
const usersMongo_service_1 = require("../services/usersMongo.service");
const winston_logger_1 = require("../logger/winston.logger");
const jwt_util_1 = require("../utils/jwt.util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserMongoController {
    //*********************CREATE NEW USER*******************//
    createNewUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield usersMongo_service_1.UsersMongoService.createNewUser(req.body);
                winston_logger_1.logger.info(`STATUS 201 : ${req.method} ${req.url}`);
                res.status(201).json({
                    message: "UserMongoController : Utilisateur ajouté avec succès",
                    user: newUser,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                    winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                    res.status(400).json({ message: error.message });
                }
                else {
                    winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                    res.status(400).json({ message: "UserMongoController : Erreur inconnue lors de la création de l'utilisateur" });
                }
            }
        });
    }
    //*********************LOGIN USER*******************//
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                    res.status(400).json({
                        message: "Veuillez renseigner tous les champs, email et mot de passe sont requis.",
                    });
                    return;
                }
                const user = yield usersMongo_service_1.UsersMongoService.findUserByEmail(email);
                if (!user) {
                    winston_logger_1.logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                    res.status(401).json({ message: "Connexion échouée" });
                    return;
                }
                const isInputPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
                if (!isInputPasswordValid) {
                    winston_logger_1.logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                    res.status(401).json({ message: "Connexion échouée" });
                    return;
                }
                // Utilisation de jsonwebtoken pour signer le jeton
                const accessToken = jsonwebtoken_1.default.sign({ user }, jwt_util_1.JWT_SECRET, {
                    expiresIn: "1h",
                });
                winston_logger_1.logger.info(`STATUS 200 : ${req.method} ${req.url}`);
                res.status(200).json({ token: accessToken });
            }
            catch (error) {
                console.error("Erreur lors du login :", error);
                winston_logger_1.logger.error(`STATUS 500 : ${req.method} ${req.url}`);
                res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
}
exports.UserMongoController = UserMongoController;
