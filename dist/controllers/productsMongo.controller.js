"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsMongoController = void 0;
const productMongo_service_1 = require("../services/productMongo.service");
class ProductsMongoController {
    async getAllProductsMongo(req, res) {
        try {
            const productsMongo = await productMongo_service_1.ProductMongoService.getAllProducts();
            res.status(200).json({
                message: "ProductMongo.Controller : Produits récupérés avec succès",
                productsMongo,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                res.status(500).json({ message: error.message });
            }
            else {
                // Cas où `error` n'est pas une instance de `Error` (ex. erreurs personnalisées)
                res.status(500).json({ message: "ProductMongo.Controller : Erreur inconnue" });
            }
        }
    }
    async postNewProduct(req, res) {
        try {
            const newProduct = await productMongo_service_1.ProductMongoService.createProduct(req.body);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit ajouté avec succès",
                product: newProduct,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                res.status(400).json({ message: error.message });
            }
            else {
                res.status(400).json({ message: "ProductMongo.Controller : Erreur inconnue lors de la création du produit" });
            }
        }
    }
    async putUpdateProduct(req, res) {
        try {
            const updatedProduct = await productMongo_service_1.ProductMongoService.updateProduct(req.params.id, req.body);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit mis à jour avec succès",
                product: updatedProduct,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "ProductMongo.Controller : Erreur inconnue lors de la mise à jour du produit" });
            }
        }
    }
    async deleteProduct(req, res) {
        try {
            const deletedProductId = await productMongo_service_1.ProductMongoService.deleteProduct(req.params.id);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit supprimé avec succès",
                deletedProductId,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "ProductMongo.Controller : Erreur inconnue lors de la suppression du produit" });
            }
        }
    }
}
exports.ProductsMongoController = ProductsMongoController;
