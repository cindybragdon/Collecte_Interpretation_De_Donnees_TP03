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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsMongoController = void 0;
const productMongo_service_1 = require("../services/productMongo.service");
const winston_logger_1 = require("../logger/winston.logger");
class ProductsMongoController {
    //*********************GET ALL PRODUCTS*******************//
    getAllProductsMongo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productsMongo = yield productMongo_service_1.ProductMongoService.getAllProducts();
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
        });
    }
    //*********************ADD NEW PRODUCT*******************//
    postNewProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newProduct = yield productMongo_service_1.ProductMongoService.createProduct(req.body);
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
        });
    }
    //*********************UPDATE PRODUCT*******************//
    putUpdateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedProduct = yield productMongo_service_1.ProductMongoService.updateProduct(req.params.id, req.body);
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
        });
    }
    //*********************DELETE PRODUCT*******************//
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedProductId = yield productMongo_service_1.ProductMongoService.deleteProduct(req.params.id);
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
        });
    }
}
exports.ProductsMongoController = ProductsMongoController;
