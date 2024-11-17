"use strict";
// Le SERVICE contient la logique métier (business logic), c'est-à-dire
// les opérations qui manipulent directement les données ou les
// exécutent. Le service est responsable d'effectuer des actions telles
// que accéder aux bases de données, lire/écrire dans des fichiers,
// ou effectuer des transformations sur les données.Exemplle, la
//fonction findById appartient au service car elle contient la logique
//de récupération des produits et de leur filtrage basé sur l'ID.
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
exports.ProductsService = void 0;
const products_model_1 = require("../models/products.model");
const fs = __importStar(require("fs"));
class ProductsService {
    //*********************GET ALL PRODUCTS*******************//
    //Elle prend tous les produits de l'API et les paramètres optionnels URL
    //Retourne un tableau de produits
    static getAllProducts() {
        return __awaiter(this, arguments, void 0, function* (minPrice = 0, maxPrice = 10000000000000, minInStock = 0, maxInStock = 10000000000000) {
            //const password = key.encrypt('password', 'base64');
            // Map des données récupérées depuis l'API à des instances de UsersModel
            //On crée des instances de Products en prenant les Products de API et en ajoutant un attibut
            const productsList = Array.from(JSON.parse(fs.readFileSync("./data/productData.json", {
                encoding: "utf8",
                flag: "r",
            })));
            console.log(productsList);
            const products = productsList.map((product) => {
                const minInStock = 0;
                const maxInStock = 500;
                const stock = Math.floor(Math.random() * (maxInStock - minInStock) + minInStock);
                return new products_model_1.ProductsModel(// Nouveau modele avec le stock en plus
                product.id, product.title, product.price, product.description, product.category, stock);
            });
            return products;
        });
    }
    //*********************GET PRODUCTS FILTERED*******************//
    static getProductsFiltered(minPrice, maxPrice, minInStock, maxInStock) {
        return __awaiter(this, void 0, void 0, function* () {
            //On va chercher tous les produits de API afin quils soient filtré
            const products = yield this.getAllProducts();
            //On filtre les produits selon les params entrés en url
            return products.filter((product) => {
                return (
                //retourne SI le minPrice est undefined OU si le product.price est plus grand ou = au minPrice ET
                (minPrice === undefined || product.price >= minPrice) &&
                    //SI le maxPrice est undefined OU si le product.price est plus petit ou = au maxPrice ET
                    (maxPrice === undefined || product.price <= maxPrice) &&
                    // SI le minStock est undefined OU si le product.inStock est plus grand ou = au minInStock ET
                    (minInStock === undefined || product.inStock >= minInStock) &&
                    //SI le maxStock est undefined OU si le product.inStock est plus petit ou = au maxInStock ET
                    (maxInStock === undefined || product.inStock <= maxInStock));
            });
        });
    }
    //*********************POST NEW PRODUCT*******************//
    static addNewProduct(newProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            //const filePath = path.join(__dirname, "../data/productData.json");
            try {
                // Lire le fichier JSON existant
                const productsList = JSON.parse(fs.readFileSync("data/productData.json", { encoding: "utf8" }));
                // Ajouter le nouveau produit à la liste
                productsList.push(newProduct);
                // Écrire la nouvelle liste dans le fichier JSON
                fs.writeFileSync("data/productData.json", JSON.stringify(productsList, null, 2));
                console.log("SERVICE POST : Le nouveau produit a été ajouté au fichier productsData.json");
            }
            catch (error) {
                console.error("SERVICE POST : Erreur lors de l'ajout du nouveau produit au fichier productsData.json", error);
                throw error;
            }
        });
    }
    //*********************GET PRODUCT BY ID*******************//
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.getAllProducts();
                const product = products.find((product) => product.id === id);
                if (!product) {
                    console.log(`Le produit ayant l'ID ${id} n'existe pas dans productsData.json.`);
                }
                return product;
            }
            catch (error) {
                console.error(`Erreur lors de la récupération du produit ayant l'ID ${id}`, error);
                throw error;
            }
        });
    }
    //*********************PUT UPDATE PRODUCT BY ID*******************//
    static updateProduct(id, updatesPost) {
        return __awaiter(this, void 0, void 0, function* () {
            //const filePath = path.join(__dirname, "data/productData.json");
            // Recherche du produit dans le JSON
            const productJson = yield this.findById(id);
            if (!productJson) {
                console.log(`Le produit ayant l'ID ${id} n'existe pas dans productsData.json`);
                return null;
            }
            // Vérification des updates
            if (updatesPost.price !== undefined && updatesPost.price <= 0) {
                throw new Error("Entrez un prix plus grand que 0");
            }
            if (updatesPost.inStock !== undefined && updatesPost.inStock < 0) {
                throw new Error("Entrez une quantité supérieure ou égale à 0");
            }
            // Application des mises à jour
            if (updatesPost.title !== undefined) {
                productJson.title = updatesPost.title;
            }
            if (updatesPost.price !== undefined) {
                productJson.price = updatesPost.price;
            }
            if (updatesPost.description !== undefined) {
                productJson.description = updatesPost.description;
            }
            if (updatesPost.inStock !== undefined) {
                productJson.inStock = updatesPost.inStock;
            }
            // Lecture et mise à jour de productsData.json
            const listOfProducts = JSON.parse(fs.readFileSync("data/productData.json", { encoding: "utf8" }));
            const updatedProductsList = listOfProducts.map((prd) => prd.id === id ? productJson : prd);
            // Écriture des mises à jour dans le fichier
            fs.writeFileSync("data/productData.json", JSON.stringify(updatedProductsList, null, 2));
            return productJson;
        });
    }
    ///*********************DELETE PRODUCT BY ID*******************//
    static deleteProductById(idBody, deleteThis) {
        return __awaiter(this, void 0, void 0, function* () {
            //const filePath = path.join(__dirname, "data/productData.json");
            // Lire le fichier JSON existant
            const productsList = Array.from(JSON.parse(fs.readFileSync("data/productData.json", {
                encoding: "utf8",
                flag: "r",
            })));
            // Trouver le produit à supprimer par ID
            const productJsonToDelete = yield this.findById(idBody);
            // Vérifiez si le produit existe et sil n'existe pas, erreur
            if (!productJsonToDelete) {
                console.log(`Vous ne pouvez retirer le produit ayant l'ID ${idBody}, il n'existe pas dans productsData.json`);
                return null;
            }
            // Utilisez l'ID du produit trouvé pour la suppression
            const indexOfProductToDelete = productsList.findIndex((product) => product.id === idBody);
            if (indexOfProductToDelete === -1) {
                console.log(`Le produit avec l'ID ${idBody} n'a pas été trouvé dans la liste.`);
                return null;
            }
            // Retirer le produit de la liste
            productsList.splice(indexOfProductToDelete, 1);
            // Écrire la nouvelle liste dans le fichier JSON
            fs.writeFileSync("data/productData.json", JSON.stringify(productsList, null, 2));
            console.log(`Vous avez retiré le produit ayant l'ID ${idBody} de productsData.json`);
            return productJsonToDelete;
        });
    }
}
exports.ProductsService = ProductsService;
