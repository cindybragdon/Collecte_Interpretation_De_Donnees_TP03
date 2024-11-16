"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const userMongo_model_1 = __importDefault(require("./models/userMongo.model"));
const fetchUSERSApiStoredInMongoDB = async () => {
    try {
        console.log("Fetch Mongo Users : Démarrage du fetch des utilisateurs depuis l'API Fake Store.");
        const response = await (0, node_fetch_1.default)("https://fakestoreapi.com/users");
        if (!response.ok) {
            throw new Error(`Fetch Mongo Users : Erreur lors de la récupération de l'API Fake Store (${response.status})`);
        }
        const users = await response.json();
        console.log("Fetch Mongo Users : Voici les utilisateurs récupérés depuis l'API Fake Store avant validation :", users);
        // Validation des utilisateurs
        const validUsers = users
            .map((user) => {
            if (!user.email || !user.password || !user.name.firstname || !user.name.lastname) {
                console.error("Fetch Mongo Users : Utilisateur incomplet :", user);
                return null;
            }
            // Format modèle MongoDB
            return {
                id: user.id,
                email: user.email,
                username: user.username || "", // Valeur par défaut si non fourni
                password: user.password, // Assurez-vous que ce mot de passe sera hashé dans une étape ultérieure
                name: {
                    firstname: user.name.firstname,
                    lastname: user.name.lastname,
                },
                role: user.role || "employe", // Par défaut, attribuez un rôle
                phone: user.phone || "",
            };
        })
            .filter(Boolean); // Garder les utilisateurs valides
        console.log(`Fetch Mongo Users : ${validUsers.length} utilisateurs valides trouvés.`);
        if (validUsers.length > 0) {
            await userMongo_model_1.default.deleteMany({}); // Vider la collection MongoDB
            console.log("Fetch Mongo Users : Collection MongoDB vidée.");
            await userMongo_model_1.default.insertMany(validUsers)
                .then((result) => {
                console.log("Utilisateurs insérés avec succès :", result);
            })
                .catch((err) => {
                console.error("Erreur d'insertion dans MongoDB :", err);
            });
        }
    }
    catch (error) {
        console.error("Fetch Mongo Users : Erreur générale :", error);
    }
};
exports.default = fetchUSERSApiStoredInMongoDB;
