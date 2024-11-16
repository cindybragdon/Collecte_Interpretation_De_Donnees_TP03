"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMongoService = void 0;
const productMongo_model_1 = __importDefault(require("../models/productMongo.model"));
// Regex adjustments to handle floating point prices and quantities
const titleRegex = /^.{3,50}$/;
const priceRegex = /^\d+(\,\d+)?$/;
const quantityRegex = /^\d+(\.\d+)?$|^0(\.\d+)?$/;
class ProductMongoService {
    static async getAllProducts(minPrice = 0, maxPrice = 999999999999, minStock = 0, maxStock = 999999999999) {
        return await productMongo_model_1.default.find({
            price: { $gte: minPrice, $lte: maxPrice },
            quantity: { $gte: minStock, $lte: maxStock }
        });
    }
    static async createProduct(data) {
        const { title, price, quantity = 0, description, category, image, rating } = data;
        if (!title || !titleRegex.test(title)) {
            throw new Error('Le champ "title" doit être renseigné et contenir entre 3 et 50 caractères.');
        }
        if (price === undefined || !priceRegex.test(price)) {
            throw new Error('Le champ "price" doit être un nombre positif.');
        }
        if (quantity !== undefined && !quantityRegex.test(quantity)) {
            throw new Error('Le champ "quantity" doit être un entier positif.');
        }
        const productToAdd = new productMongo_model_1.default({
            title, price, description, category, image, rating, quantity
        });
        return await productToAdd.save();
    }
    static async updateProduct(id, data) {
        const { title, price, quantity } = data;
        if (title && !titleRegex.test(title)) {
            throw new Error('Le champ "title" doit contenir entre 3 et 50 caractères.');
        }
        if (price !== undefined && !priceRegex.test(price)) {
            throw new Error('Le champ "price" doit être un nombre positif.');
        }
        if (quantity !== undefined && !quantityRegex.test(quantity)) {
            throw new Error('Le champ "quantity" doit être un entier positif.');
        }
        return await productMongo_model_1.default.findByIdAndUpdate(id, data, { new: true });
    }
    static async getProductById(id) {
        return await productMongo_model_1.default.findById(id);
    }
    static async deleteProduct(id) {
        const product = await productMongo_model_1.default.findById(id);
        if (!product)
            throw new Error("Produit non trouvé");
        const result = await productMongo_model_1.default.deleteOne({ _id: id });
        if (result.deletedCount === 0)
            throw new Error("Échec de la suppression du produit");
        return id;
    }
}
exports.ProductMongoService = ProductMongoService;
