import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';
//import { roleMiddleware } from '../middlewares/roles.middleware';
//import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const productsController = new ProductsController();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of product from this API --> https://fakestoreapi.com/products
 *     description: Retrieve a list of products from the API. Can be used to populate a list of products in your system.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schemas:
 *      id: number,
        title: string,
        price: number,
        description: string,
        category: string,
        public inStock: number
 */
router.get('/products', productsController.getAllProducts);

//router.get('/admin', verifyToken, roleMiddleware(['admin']), UserController.getAdminData);

export default router;