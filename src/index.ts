import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/users.route";
import productRoutes from "./routes/products.route";
import { UsersService } from "./services/users.service";
import { ProductsService } from "./services/products.service";
import { fetchProductsFromAPi } from "./fetchProductsApi";
import { fetchUsersFromAPi } from "./fetchUsersApi";
import { errorMiddleware } from "./middlewares/error.middleware";

const path = require("path");
const fs = require("fs");
const https = require("https");

const app = express();
const port = 3000;

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Définir les options de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "A simple API to manage users",
    },
  },
  apis: ["./src/routes/*.ts"], // Fichier où les routes de l'API sont définies
};

// Générer la documentation à partir des options
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Servir la documentation Swagger via '/api-docs'
app.use("/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware de login
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware de parsing du JSON
app.use(express.json());

// Route de base
app.get("/v1", (req: Request, res: Response) => {
  res.send("Hello, site HTTPS securisé!");
});

// Charger le certificat et la clé
const options = {
  key: fs.readFileSync(path.join(__dirname, "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
};

app.use("/", userRoutes);
app.use("/", productRoutes);

// Middleware de gestion des erreurs
app.use("/", errorMiddleware);

// Démarrage du serveur
https.createServer(options, app).listen(port, () => {
  console.log(`Serveur en écoute sur <https://localhost>:${port}`);
  console.log("DÉMARRAGE SERVEUR On est dans index");
  fetchProductsFromAPi();
  fetchUsersFromAPi();
});
