"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const userMongo_model_1 = __importDefault(require("./models/userMongo.model"));
// Fetch des users sur l'API
const fetchUSERSApiStoredInMongoDB = async () => {
    try {
        const response = await (0, node_fetch_1.default)('https://fakestoreapi.com/users');
        const users = await response.json();
        console.log('Fetch Mongo : Utilisateurs récupérés depuis l\'API Fake Store :', users);
        // Validation des utilisateurs
        const validUsers = users
            .map((user) => {
            if (!user.name.firstname || !user.password) {
                console.error('Fetch Mongo : Utilisateur incomplet:', user);
                return null;
            }
            // Format modèle MongoDB
            return {
                id: user.id,
                email: user.email,
                role: user.role,
                username: user.username,
                password: user.password,
                name: {
                    firstname: user.name.firstname,
                    lastname: user.name.lastname,
                },
                phone: user.phone,
            };
        })
            .filter(Boolean); // Garder les utilisateurs valides
        // Push les utilisateurs valides dans MongoDB
        if (validUsers.length > 0) {
            await insertUsersToMongoDB(validUsers);
        }
        else {
            console.log('Fetch Mongo : Aucun utilisateur valide à insérer.');
        }
    }
    catch (error) {
        console.error('Fetch Mongo : Erreur lors de la récupération des utilisateurs :', error);
    }
};
// Fonction push des utilisateurs dans MongoDB
const insertUsersToMongoDB = async (users) => {
    try {
        // Delete Many vide la collection pour éviter les doublons
        await userMongo_model_1.default.deleteMany({});
        // Insert all utilisateurs dans MongoDB
        await userMongo_model_1.default.insertMany(users);
        console.log('Fetch Mongo : MongoDB peuplé de utilisateurs avec succès!');
    }
    catch (error) {
        console.error('Fetch Mongo : Erreur lors de la population des utilisateurs dans MongoDB :', error);
    }
};
exports.default = fetchUSERSApiStoredInMongoDB;
