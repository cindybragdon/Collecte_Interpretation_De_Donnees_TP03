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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUsersFromAPi = fetchUsersFromAPi;
//import * as fs from "fs";
const path = __importStar(require("path"));
const users_model_1 = require("./models/users.model");
const bcrypt = require("bcryptjs");
const fs = require("fs");
async function fetchUsersFromAPi() {
    // Fetch API qui renvoie les utilisateurs au format JSON
    const usersFromApi = await fetch("https://fakestoreapi.com/users").then((response) => response.json());
    //Populer le JSON avec productsData
    //const productsData = JSON.stringify(products, null, 2);
    const usersData = JSON.stringify(usersFromApi, null, 2);
    const filePath = path.join(__dirname, "data/usersData.json");
    //Si le répertoire n'existe pas, crée le
    //if (!fs.existsSync(filePath)) {
    //  fs.mkdirSync(filePath, { recursive: true });
    // }
    const userList = JSON.parse(usersData);
    const users = userList.map((user) => {
        const roleEmploye = "employe";
        const roleGestionnaire = "gestionnaire";
        const role = user.id % 3 === 0 ? roleGestionnaire : roleEmploye;
        const hashedPassword = bcrypt.hash(user.password, 10);
        return new users_model_1.UsersModel({
            geolocation: {
                lat: user.address.geolocation.lat,
                long: user.address.geolocation.long,
            },
            city: user.address.city,
            street: user.address.street,
            number: user.address.number,
            zipcode: user.address.zipcode,
        }, user.id, user.email, role, user.username, hashedPassword, {
            firstname: user.name.firstname,
            lastname: user.name.lastname,
        }, user.phone, user.__v);
    });
    try {
        //console.log(users)
        fs.writeFileSync("data/usersData.json", JSON.stringify(users, null, 2));
        console.log("FETCH USER : Le fichier usersData.json est populé par API FakeStore/users");
    }
    catch (err) {
        console.error("SERVICE : Erreur lors de lécriture de usersData dans usersData.json");
    }
}
