"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsMongoController = void 0;
const productMongo_model_1 = __importDefault(require("../models/productMongo.model"));
class ProductsMongoController {
    constructor() {
        this.getAllProductsMongo = async (req, res) => {
            try {
                const productsMongo = await productMongo_model_1.default.find();
                res.status(200).json({
                    message: "PruductsMongo.Controller : On est cool, voici les produits : ",
                    productsMongo,
                });
            }
            catch (error) {
                console.error(error);
                res.status(400).json({ message: "ProductsMongo.Controller : Erreur lors du get des produits" });
            }
        };
    }
}
exports.ProductsMongoController = ProductsMongoController;
