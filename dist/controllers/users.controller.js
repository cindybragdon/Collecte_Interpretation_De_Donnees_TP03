"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const users_service_1 = require("../services/users.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const users_model_1 = require("../models/users.model");
const winston_logger_1 = require("../logger/winston.logger");
class UserController {
    constructor() {
        //*********************REGISTER NEW USER*******************//
        this.userConnected = async (req, res) => {
            const usersList = Array.from(JSON.parse(fs.readFileSync("data/usersData.json", {
                encoding: "utf8",
                flag: "r",
            })));
            const id = usersList.length + 1;
            //console.log(req.body);
            const hashedPassword = await bcryptjs_1.default.hash(req.body.password, 10);
            const newUser = new users_model_1.UsersModel(req.body.adresse, id, req.body.email, req.body.role, req.body.username, hashedPassword, req.body.name, req.body.phone, req.body.__v);
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const isValidEmail = () => {
                return emailRegex.test(req.body.email);
            };
            if (isValidEmail()) {
                usersList.push(newUser);
                const usersListModified = JSON.stringify(usersList, null, 2);
                const filePath = path.join(__dirname, "../../data/usersData.json");
                //Si le répertoire n'existe pas, crée le
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath, { recursive: true });
                }
                try {
                    fs.writeFileSync(filePath, usersListModified);
                    console.log("UsersController : Le user a été créé avec succès dans usersData.json");
                    winston_logger_1.logger.info(`STATUS 201 : ${req.method} ${req.url}`);
                    res.status(201).send("Utilisateur enregistré");
                }
                catch (error) {
                    console.error("UsersController : Erreur lors de lécriture du nouveau user dans usersData.json", error);
                }
            }
        };
        //*********************LOGIN BY EMAIL AND ROLE*******************//
        this.loginByEmail = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                    res.status(400).json({
                        message: "Veuillez renseigner tous les champs, email et mot de passe sont requis.",
                    });
                    return;
                }
                const user = await users_service_1.UsersService.findUserEmail(email);
                if (!user) {
                    winston_logger_1.logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                    res.status(401).json({ message: "Connexion echouée" });
                    return;
                }
                // Comparer le mot de passe req.body avec le mot de passe stocké dans usersData.json
                const isInputPasswordValid = await bcryptjs_1.default.compare(password, user.password);
                //Si le mot de passe n'est pas valide
                if (!isInputPasswordValid) {
                    winston_logger_1.logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                    res.status(401).json({ message: "Connexion echouée" });
                    return;
                }
                //Si password valide, on génère un token JWT qui expire dans 1h
                const accessToken = jsonwebtoken_1.default.sign({ user }, "VIOLETTE", {
                    expiresIn: "1h",
                });
                // Réponse JSON incluant le token JWT
                winston_logger_1.logger.info(`STATUS 200 : ${req.method} ${req.url}`);
                res.status(200).json({ token: accessToken });
                return;
            }
            catch (error) {
                console.error("Erreur lors du login :", error);
                winston_logger_1.logger.error(`STATUS 500 : ${req.method} ${req.url}`);
                res.status(500).json({ message: "Erreur serveur" });
                return;
            }
        };
    }
    //*********************GET ALL USERS*******************//
    async getAllUsers(req, res) {
        console.log(req.headers);
        console.log("REFRESH BROWSER On est dans UserController");
        const users = await users_service_1.UsersService.getAllUsers();
        res.json(users);
    }
    static async getAdminData(req, res) {
        res.json({ message: "Données réservées aux administrateurs." });
        return;
    }
}
exports.UserController = UserController;
