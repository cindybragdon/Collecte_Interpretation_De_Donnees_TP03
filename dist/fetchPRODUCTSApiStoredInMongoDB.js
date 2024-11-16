"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const productMongo_model_1 = __importDefault(require("./models/productMongo.model"));
const fetchPRODUCTSApiStoredInMongoDB = async () => {
    try {
        console.log("Fetch Mongo : Démarrage du fetch des produits depuis l'API Fake Store.");
        const response = await (0, node_fetch_1.default)("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error(`Fetch Mongo : Erreur lors de la récupération de l'API Fake Store (${response.status})`);
        }
        const products = await response.json();
        console.log("Fetch Mongo : Voici les Produits récupérés depuis l'API Fake Store avant validation : ", products);
        // Validation des produits
        const validProducts = products
            .map((product) => {
            // Validation sur le champ title et price.  Les autres données sont facultatives, mais ces champs aident à find() et sont essentiels.
            if (!(product.title.length >= 3 && product.title.length <= 50)) {
                console.error('Fetch Mongo : Produit non valide:', product);
                return null;
            }
            if (!product.title || !product.price) {
                console.error('Fetch Mongo : Produit incomplet:', product);
                return null;
            }
            // Format modèle MongoDB
            return {
                id: product.id,
                title: product.title,
                description: product.description,
                category: product.category,
                price: product.price,
                image: product.image,
                rating: product.rating,
            };
        })
            .filter(Boolean); // Garder les produits valides
        console.log(`Fetch Mongo : ${validProducts.length} produits valides trouvés.`);
        if (validProducts.length > 0) {
            await productMongo_model_1.default.deleteMany({}); // Vider la collection MongoDB
            console.log("Fetch Mongo : Collection MongoDB vidée.");
            await productMongo_model_1.default.insertMany(validProducts) // Utiliser les produits validés
                .then((result) => {
                console.log("Produits insérés avec succès :", result);
            })
                .catch((err) => {
                console.error("Erreur d'insertion dans MongoDB :", err);
            });
        }
    }
    catch (error) {
        console.error("Fetch Mongo : Erreur générale :", error);
    }
};
exports.default = fetchPRODUCTSApiStoredInMongoDB;
