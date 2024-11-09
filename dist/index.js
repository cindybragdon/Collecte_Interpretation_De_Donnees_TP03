"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const products_route_1 = __importDefault(require("./routes/products.route"));
const productsMongo_route_1 = __importDefault(require("./routes/productsMongo.route"));
const fetchProductsApi_1 = require("./fetchProductsApi");
const fetchUsersApi_1 = require("./fetchUsersApi");
const error_middleware_1 = require("./middlewares/error.middleware");
const fetchApiStoredInMongoDB_1 = __importDefault(require("./fetchApiStoredInMongoDB"));
const mongoose_1 = __importDefault(require("mongoose"));
const path = require("path");
const fs = require("fs");
const https = require("https");
const app = (0, express_1.default)();
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
// Configuration de Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FakeStore management API by Cindy Bragdon",
            version: "1.0.0",
            description: "A simple API to manage users",
        },
    },
    apis: ["./src/routes/*.ts"],
};
// Générer et servir la documentation Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Middleware de log
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Middleware de parsing JSON
app.use(express_1.default.json());
// Route de base
app.get("/v1", (req, res) => {
    res.send("Hello, site HTTPS sécurisé!");
});
// Charger le certificat et la clé pour HTTPS
const options = {
    key: fs.readFileSync(path.join(__dirname, "../src/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../src/cert.pem")),
};
// Utiliser les routes pour les utilisateurs et les produits
app.use("/", users_route_1.default);
app.use("/", products_route_1.default);
// Routes MongoDB
app.use("/api/mongodb", productsMongo_route_1.default);
// Middleware de gestion des erreurs
app.use("/", error_middleware_1.errorMiddleware);
// Connexion à MongoDB
const MONGO_URI = 'mongodb+srv://cindybragdon:abc-123@cluster0.k9lfh.mongodb.net/mongoDb_Api_RESTful_PROD';
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log("Index : Connecté à MongoDB!!"))
    .catch((err) => console.error("Index : Erreur de connexion MongoDB :", err));
// Appeler le fetch pour peupler MongoDB avec les produits de l'API Fake Store au démarrage
(0, fetchApiStoredInMongoDB_1.default)()
    .then(() => console.log("Index : Produits importés de l'API Fake Store"))
    .catch((error) => console.error("Index : Erreur lors de l'importation des produits :", error));
// Démarrage du serveur en HTTPS
https.createServer(options, app).listen(port, () => {
    console.log(`Serveur en écoute sur <https://localhost>:${port}`);
    console.log("DÉMARRAGE SERVEUR On est dans index");
    (0, fetchProductsApi_1.fetchProductsFromAPi)();
    (0, fetchUsersApi_1.fetchUsersFromAPi)();
});
