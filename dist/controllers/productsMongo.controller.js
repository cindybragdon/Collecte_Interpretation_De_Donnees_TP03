"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsMongoController = void 0;
const productMongo_service_1 = require("../services/productMongo.service");
const winston_logger_1 = require("../logger/winston.logger");
class ProductsMongoController {
    //*********************GET ALL PRODUCTS*******************//
    async getAllProductsMongo(req, res) {
        try {
            const productsMongo = await productMongo_service_1.ProductMongoService.getAllProducts();
            winston_logger_1.logger.info(`STATUS 200 : ${req.method} ${req.url}`);
            res.status(200).json({
                message: "ProductMongo.Controller : Produits récupérés avec succès",
                productsMongo,
            });
        }
        catch (error) {
            winston_logger_1.logger.error(`STATUS 500 : ${req.method} ${req.url} - ${error}`);
            res.status(500).json({ message: "ProductMongo.Controller : Erreur lors de la récupération des produits" });
        }
    }
    //*********************ADD NEW PRODUCT*******************//
    async postNewProduct(req, res) {
        try {
            const newProduct = await productMongo_service_1.ProductMongoService.createProduct(req.body);
            winston_logger_1.logger.info(`STATUS 200 : ${req.method} ${req.url}`);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit ajouté avec succès",
                product: newProduct,
            });
        }
        catch (error) {
            winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url} - ${error}`);
            res.status(400).json({ message: "ProductMongo.Controller : Erreur lors de la création du produit" });
        }
    }
    //*********************UPDATE PRODUCT*******************//
    async putUpdateProduct(req, res) {
        try {
            const updatedProduct = await productMongo_service_1.ProductMongoService.updateProduct(req.params.id, req.body);
            winston_logger_1.logger.info(`STATUS 200 : ${req.method} ${req.url}`);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit mis à jour avec succès",
                product: updatedProduct,
            });
        }
        catch (error) {
            winston_logger_1.logger.error(`STATUS 500 : ${req.method} ${req.url} - ${error}`);
            res.status(500).json({ message: "ProductMongo.Controller : Erreur lors de la mise à jour du produit" });
        }
    }
    //*********************DELETE PRODUCT*******************//
    async deleteProduct(req, res) {
        try {
            const deletedProductId = await productMongo_service_1.ProductMongoService.deleteProduct(req.params.id);
            winston_logger_1.logger.info(`STATUS 200 : ${req.method} ${req.url}`);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit supprimé avec succès",
                deletedProductId,
            });
        }
        catch (error) {
            winston_logger_1.logger.error(`STATUS 500 : ${req.method} ${req.url} - ${error}`);
            res.status(500).json({ message: "ProductMongo.Controller : Erreur lors de la suppression du produit" });
        }
    }
}
exports.ProductsMongoController = ProductsMongoController;
