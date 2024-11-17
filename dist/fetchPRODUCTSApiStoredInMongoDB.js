"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const productMongo_model_1 = __importDefault(require("./models/productMongo.model"));
const fetchPRODUCTSApiStoredInMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Fetch Mongo : Démarrage du fetch des produits depuis l'API Fake Store.");
        const response = yield (0, node_fetch_1.default)("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error(`Fetch Mongo : Erreur lors de la récupération de l'API Fake Store (${response.status})`);
        }
        const products = yield response.json();
        console.log("Fetch Mongo : Voici les Produits récupérés depuis l'API Fake Store avant validation : ", products);
        // Validation des produits
        const validProducts = products
            .map((product) => {
            if (!(product.title.length >= 3 && product.title.length <= 50)) {
                console.log('Fetch Mongo : Produit non valide:', product);
                return null;
            }
            if (!product.title || !product.price) {
                console.log('Fetch Mongo : Produit incomplet:', product);
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
            yield productMongo_model_1.default.deleteMany({});
            console.log("Fetch Mongo : Collection MongoDB vidée.");
            yield productMongo_model_1.default.insertMany(validProducts)
                .then((result) => {
                console.log("Produits insérés avec succès :", result);
            })
                .catch((err) => {
                console.log("Erreur d'insertion dans MongoDB :", err);
            });
        }
    }
    catch (error) {
        console.log("Fetch Mongo : Erreur générale :", error);
    }
});
exports.default = fetchPRODUCTSApiStoredInMongoDB;
