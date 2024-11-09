import ProductModeleSchema from "../models/productMongo.model";
import { Request, Response } from 'express';

export class ProductsMongoController {

    public getAllProductsMongo = async (
        req : Request, 
        res: Response)
        :Promise<void> => {
            try {
                const productsMongo = await ProductModeleSchema.find();
                res.status(200).json({
                    message: "PruductsMongo.Controller : On est cool, voici les produits : ",
                    productsMongo,
                  });
            }catch(error){
                console.error(error);
                res.status(400).json({ message: "ProductsMongo.Controller : Erreur lors du get des produits" });
            }
        };    
}