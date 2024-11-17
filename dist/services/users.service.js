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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const users_model_1 = require("../models/users.model");
const fs = __importStar(require("fs"));
class UsersService {
    //*********************GET ALL USERS PLUS GENERATED PASSWORD*******************//
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // Charger les données utilisateur à partir d'un fichier JSON
            const usersList = Array.from(JSON.parse(fs.readFileSync("./data/usersData.json", {
                encoding: "utf8",
                flag: "r",
            })));
            // Mapper les données récupérées depuis l'API à des instances de UsersModel en ajoutant un passeword généré
            const users = usersList.map((user) => {
                return new users_model_1.UsersModel({
                    geolocation: {
                        lat: user.address.geolocation.lat,
                        long: user.address.geolocation.long,
                    },
                    city: user.address.city,
                    street: user.address.street,
                    number: user.address.number,
                    zipcode: user.address.zipcode,
                }, user.id, user.email, user.role, user.username, user.password, {
                    firstname: user.name.firstname,
                    lastname: user.name.lastname,
                }, user.phone, user.__v);
            });
            return users;
        });
    }
    //*********************GET USER BY EMAIL*******************//
    static findUserEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.getAllUsers();
                const user = users.find((user) => user.email === email);
                if (!email) {
                    console.log(`Le email ${email} n'existe pas dans usersData.json.`);
                }
                return user;
            }
            catch (error) {
                console.error(`Erreur lors de la récupération du email ${email}`, error);
                throw error;
            }
        });
    }
}
exports.UsersService = UsersService;
