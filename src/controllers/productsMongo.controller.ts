import { Request, Response } from 'express';
import { ProductMongoService } from "../services/productMongo.service";
import { logger } from '../logger/winston.logger';

export class ProductsMongoController {

    //*********************GET ALL PRODUCTS*******************//
    public async getAllProductsMongo(req: Request, res: Response): Promise<void> {
        try {
            const productsMongo = await ProductMongoService.getAllProducts();
            logger.info(`STATUS 200 : ${req.method} ${req.url}`);
            res.status(200).json({
                message: "ProductMongo.Controller : Produits récupérés avec succès",
                productsMongo,
            });
        } catch (error) {
            logger.error(`STATUS 500 : ${req.method} ${req.url} - ${error}`);
            res.status(500).json({ message: "ProductMongo.Controller : Erreur lors de la récupération des produits" });
        }
    }

    //*********************ADD NEW PRODUCT*******************//
    public async postNewProduct(req: Request, res: Response): Promise<void> {
        try {
            const newProduct = await ProductMongoService.createProduct(req.body);
            logger.info(`STATUS 200 : ${req.method} ${req.url}`);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit ajouté avec succès",
                product: newProduct,
            });
        } catch (error) {
            logger.error(`STATUS 400 : ${req.method} ${req.url} - ${error}`);
            res.status(400).json({ message: "ProductMongo.Controller : Erreur lors de la création du produit" });
        }
    }

    //*********************UPDATE PRODUCT*******************//
    public async putUpdateProduct(req: Request, res: Response): Promise<void> {
        try {
            const updatedProduct = await ProductMongoService.updateProduct(req.params.id, req.body);
            logger.info(`STATUS 200 : ${req.method} ${req.url}`);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit mis à jour avec succès",
                product: updatedProduct,
            });
        } catch (error) {
            logger.error(`STATUS 500 : ${req.method} ${req.url} - ${error}`);
            res.status(500).json({ message: "ProductMongo.Controller : Erreur lors de la mise à jour du produit" });
        }
    }

    //*********************DELETE PRODUCT*******************//
    public async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const deletedProductId = await ProductMongoService.deleteProduct(req.params.id);
            logger.info(`STATUS 200 : ${req.method} ${req.url}`);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit supprimé avec succès",
                deletedProductId,
            });
        } catch (error) {
            logger.error(`STATUS 500 : ${req.method} ${req.url} - ${error}`);
            res.status(500).json({ message: "ProductMongo.Controller : Erreur lors de la suppression du produit" });
        }
    }
}
