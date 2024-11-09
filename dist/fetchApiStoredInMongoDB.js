"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const productMongo_model_1 = __importDefault(require("./models/productMongo.model")); // Assurez-vous que ProductMongo est bien défini et importé
// Fetch des produits sur l'API
const fetchApiStoredInMongoDB = async () => {
    try {
        const response = await (0, node_fetch_1.default)('https://fakestoreapi.com/products');
        const products = await response.json();
        console.log('Produits récupérés depuis l\'API Fake Store :', products);
        // Validation et transformation des produits
        const validProducts = products
            .map((product) => {
            // Validation sur le champ title et price
            if (!product.title || !product.price) {
                console.error('Produit incomplet:', product);
                return null;
            }
            // Transformation en un format qui correspond au modèle MongoDB
            return {
                id: product.id,
                title: product.title, // Utilisez title ici, pas name
                description: product.description,
                category: product.category,
                price: product.price,
                image: product.image,
                rating: product.rating,
            };
        })
            .filter(Boolean); // Filtre pour ne garder que les produits valides
        // Push les produits valides dans MongoDB
        if (validProducts.length > 0) {
            await insertProductsToMongoDB(validProducts);
        }
        else {
            console.log('Aucun produit valide à insérer.');
        }
    }
    catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
    }
};
// Fonction push des produits dans MongoDB
const insertProductsToMongoDB = async (products) => {
    try {
        // Insert all products dans MongoDB
        await productMongo_model_1.default.insertMany(products); // Utilisez votre modèle MongoDB pour l'insertion
        console.log('MongoDB populé avec succès!');
    }
    catch (error) {
        console.error('Erreur lors de la population des produits dans MongoDB :', error);
    }
};
// Exportation de la fonction principale
exports.default = fetchApiStoredInMongoDB;
