import { Router } from "express";
import { ProductsController } from "../controllers/products.controller";
import { ProductsService } from "../services/products.service";
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
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   title:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   inStock:
 *                     type: number
 *
 *   post:
 *     summary: Add POST a new product
 *     description: Create a new product in file productsData.json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               inStock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully in file productsData.json.
 *       400:
 *         description: Invalid input.
 *
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     description: Update an existing product's details in file productsData.json.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update in file productsData.json.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               inStock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully in file productsData.json.
 *       404:
 *         description: Product not found in file productsData.json.
 *       400:
 *         description: Invalid input.
 *
 *   get:
 *     summary: Retrieve a filtered list of products
 *     description: Retrieve a list of products based on optional filters.
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         required: false
 *         description: Minimum price of the products to retrieve.
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         description: Maximum price of the products to retrieve.
 *         schema:
 *           type: number
 *       - in: query
 *         name: minInStock
 *         required: false
 *         description: Minimum stock level of the products to retrieve.
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxInStock
 *         required: false
 *         description: Maximum stock level of the products to retrieve.
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: A filtered list of products in file productsData.json.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   title:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   inStock:
 *                     type: number
 */

////http://localhost:3000/products
router.get("/products", productsController.getAllProducts);

//http://localhost:3000/products?minPrice=0&maxPrice=1000&minInStock=0&maxInStock=20
router.get(
  "/products/:minPrice?/:maxPrice?/:minInStock?/:maxInStock?",
  productsController.getAllProducts
);

router.post("/products", productsController.postNewProduct);

router.put("/products/:id", productsController.putProduct);

router.delete("/products/:id", productsController.deleteProduct);

//router.get('/admin', verifyToken, roleMiddleware(['admin']), UserController.getAdminData);

export default router;
