import { Request, Response } from 'express';
import { ProductMongoService } from "../services/productMongo.service";

export class ProductsMongoController {
    public async getAllProductsMongo(req: Request, res: Response): Promise<void> {
        try {
            const productsMongo = await ProductMongoService.getAllProducts();
            res.status(200).json({
                message: "ProductMongo.Controller : Produits récupérés avec succès",
                productsMongo,
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                res.status(500).json({ message: error.message });
            } else {
                // Cas où `error` n'est pas une instance de `Error` (ex. erreurs personnalisées)
                res.status(500).json({ message: "ProductMongo.Controller : Erreur inconnue" });
            }
        }
    }

    public async postNewProduct(req: Request, res: Response): Promise<void> {
        try {
            const newProduct = await ProductMongoService.createProduct(req.body);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit ajouté avec succès",
                product: newProduct,
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: "ProductMongo.Controller : Erreur inconnue lors de la création du produit" });
            }
        }
    }

    public async putUpdateProduct(req: Request, res: Response): Promise<void> {
        try {
            const updatedProduct = await ProductMongoService.updateProduct(req.params.id, req.body);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit mis à jour avec succès",
                product: updatedProduct,
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: "ProductMongo.Controller : Erreur inconnue lors de la mise à jour du produit" });
            }
        }
    }

    public async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const deletedProductId = await ProductMongoService.deleteProduct(req.params.id);
            res.status(200).json({
                message: "ProductMongo.Controller : Produit supprimé avec succès",
                deletedProductId,
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: "ProductMongo.Controller : Erreur inconnue lors de la suppression du produit" });
            }
        }
    }
}
