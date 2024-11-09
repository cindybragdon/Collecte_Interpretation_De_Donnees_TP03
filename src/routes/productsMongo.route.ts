import { Router } from 'express';
import { ProductsMongoController } from '../controllers/productsMongo.controller';

const router = Router();
const productMongoController = new ProductsMongoController();

// Version 2 de l'API
router.get('/v2/products', productMongoController.getAllProductsMongo);

export default router;