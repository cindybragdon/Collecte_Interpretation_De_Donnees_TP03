import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/users.route";
import productRoutes from "./routes/products.route";
import productMongoRoutes from './routes/productsMongo.route';
import { fetchProductsFromAPi } from "./fetchProductsApi";
import { fetchUsersFromAPi } from "./fetchUsersApi";
import { errorMiddleware } from "./middlewares/error.middleware";
import fetchApiStoredInMongoDB from './fetchApiStoredInMongoDB';
import mongoose from 'mongoose';

const path = require("path");
const fs = require("fs");
const https = require("https");

const app = express();
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
app.use(express.json());

// Route de base
app.get("/v1", (req: Request, res: Response) => {
  res.send("Hello, site HTTPS sécurisé!");
});

// Charger le certificat et la clé pour HTTPS
const options = {
  key: fs.readFileSync(path.join(__dirname, "../src/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../src/cert.pem")),
};

// Utiliser les routes pour les utilisateurs et les produits
app.use("/", userRoutes);
app.use("/", productRoutes);

// Routes MongoDB
app.use("/api/mongodb", productMongoRoutes);

// Middleware de gestion des erreurs
app.use("/", errorMiddleware);

// Connexion à MongoDB
const MONGO_URI = 'mongodb+srv://cindybragdon:abc-123@cluster0.k9lfh.mongodb.net/mongoDb_Api_RESTful_PROD';
mongoose.connect(MONGO_URI)
  .then(() => console.log("Index : Connecté à MongoDB!!"))
  .catch((err) => console.error("Index : Erreur de connexion MongoDB :", err));

// Appeler le fetch pour peupler MongoDB avec les produits de l'API Fake Store au démarrage
fetchApiStoredInMongoDB()
  .then(() => console.log("Index : Produits importés de l'API Fake Store"))
  .catch((error) => console.error("Index : Erreur lors de l'importation des produits :", error));

// Démarrage du serveur en HTTPS
async function populateJsonIfEmpty() {
  const productsFilePath = path.join(__dirname, "productsData.json");
  const usersFilePath = path.join(__dirname, "usersData.json");

  if (!fs.existsSync(productsFilePath) || fs.readFileSync(productsFilePath, "utf-8").trim() === "") {
    await fetchProductsFromAPi();
  }
  
  if (!fs.existsSync(usersFilePath) || fs.readFileSync(usersFilePath, "utf-8").trim() === "") {
    await fetchUsersFromAPi();
  }
}

// Démarrage du serveur en HTTPS
https.createServer(options, app).listen(port, () => {
  console.log(`Serveur en écoute sur <https://localhost>:${port}`);
  populateJsonIfEmpty()
    .then(() => console.log("Vérification des fichiers JSON complétée."))
    .catch((error) => console.error("Erreur lors de la vérification des fichiers JSON :", error));

});
