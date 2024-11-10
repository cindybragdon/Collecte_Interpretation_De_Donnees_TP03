"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMongoService = void 0;
const productMongo_model_1 = __importDefault(require("../models/productMongo.model"));
const titleRegex = /^.{3,50}$/;
const priceRegex = /^(0|[1-9][0-9]*)$/;
const quantityRegex = /^(0|[1-9][0-9]*)$/;
class ProductMongoService {
    // Méthode pour récupérer tous les produits
    static async getAllProducts() {
        try {
            return await productMongo_model_1.default.find();
        }
        catch (error) {
            throw new Error("ProductMongo.Service : Erreur lors de la récupération des produits");
        }
    }
    // Méthode pour créer un nouveau produit
    static async createProduct(data) {
        const { title, price, quantity } = data;
        // Validation des champs
        if (!title || !titleRegex.test(title)) {
            throw new Error('ProductMongo.Service : Le champ "title" doit être renseigné et contenir entre 3 et 50 caractères.');
        }
        if (!price || !priceRegex.test(price)) {
            throw new Error('ProductMongo.Service : Le champ "price" doit être renseigné et être un entier positif.');
        }
        if (quantity && !quantityRegex.test(quantity)) {
            throw new Error('ProductMongo.Service : Le champ "quantity" doit être un entier positif.');
        }
        const { description, category, image, rating } = data;
        const productToAdd = new productMongo_model_1.default({
            title, price, description, category, image, rating, quantity
        });
        try {
            return await productToAdd.save();
        }
        catch (error) {
            throw new Error("ProductMongo.Service : Erreur lors de l'ajout du produit");
        }
    }
    // Méthode pour mettre à jour un produit existant
    static async updateProduct(id, data) {
        const { title, price, quantity } = data;
        // Validation des champs
        if (title && !titleRegex.test(title)) {
            throw new Error('ProductMongo.Service : Le champ "title" doit être contenu entre 3 et 50 caractères.');
        }
        if (price && !priceRegex.test(price)) {
            throw new Error('ProductMongo.Service : Le champ "price" doit être un entier positif.');
        }
        if (quantity && !quantityRegex.test(quantity)) {
            throw new Error('ProductMongo.Service : Le champ "quantity" doit être un entier positif.');
        }
        try {
            const product = await productMongo_model_1.default.findById(id);
            if (!product)
                throw new Error("ProductMongo.Service : Produit non trouvé");
            // Mettre à jour les champs
            Object.assign(product, data);
            return await product.save();
        }
        catch (error) {
            throw new Error("ProductMongo.Service : Erreur lors de la mise à jour du produit");
        }
    }
    // Méthode pour supprimer un produit
    static async deleteProduct(id) {
        try {
            const product = await productMongo_model_1.default.findById(id);
            if (!product)
                throw new Error("ProductMongo.Service : Produit non trouvé");
            await productMongo_model_1.default.deleteOne({ _id: id });
            return id;
        }
        catch (error) {
            throw new Error("ProductMongo.Service : Erreur lors de la suppression du produit");
        }
    }
}
exports.ProductMongoService = ProductMongoService;
