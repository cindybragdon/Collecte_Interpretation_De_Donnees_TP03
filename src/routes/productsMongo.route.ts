import { Router } from 'express';
import { ProductsMongoController } from '../controllers/productsMongo.controller';

const router = Router();
const productMongoController = new ProductsMongoController();

// Version 2 de l'API
router.get('/v2/products', productMongoController.getAllProductsMongo);

router.post('/v2/products', productMongoController.postNewProduct);

router.put('/v2/products:id', productMongoController.putUpdateProduct);

router.delete('/v2/products:id', productMongoController.deleteProduct);

export default router;