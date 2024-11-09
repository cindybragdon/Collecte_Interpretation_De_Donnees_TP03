"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("../controllers/products.controller");
const roles_middleware_1 = require("../middlewares/roles.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const productsController = new products_controller_1.ProductsController();
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: FakeStore management API
 */
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Fetch a list of products from the local database or external API. Can be used to display products in the application.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/products", productsController.getAllProducts);
//http://localhost:3000/products?minPrice=0&maxPrice=1000&minInStock=0&maxInStock=20
router.get("/products/:minPrice?/:maxPrice?/:minInStock?/:maxInStock?", productsController.getAllProducts);
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Adds a new product to the system and stores it in the productsData.json file.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post("/products", auth_middleware_1.verifyToken, (0, roles_middleware_1.roleMiddleware)(["gestionnaire"]), productsController.postNewProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     description: Updates the details of an existing product based on the product ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       404:
 *         description: Product not found.
 *       400:
 *         description: Invalid input data.
 */
router.put("/products/:id", auth_middleware_1.verifyToken, (0, roles_middleware_1.roleMiddleware)(["gestionnaire"]), productsController.putProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Removes a product from the system by its ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to delete.
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 */
router.delete("/products/:id", auth_middleware_1.verifyToken, (0, roles_middleware_1.roleMiddleware)(["gestionnaire"]), productsController.deleteProduct);
exports.default = router;
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - description
 *         - category
 *         - inStock
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product.
 *         title:
 *           type: string
 *           description: The title of the product.
 *         price:
 *           type: number
 *           description: The price of the product.
 *         description:
 *           type: string
 *           description: A detailed description of the product.
 *         category:
 *           type: string
 *           description: The category of the product.
 *         inStock:
 *           type: number
 *           description: The quantity of the product in stock.
 *       example:
 *         id: 1
 *         title: "Sample Product"
 *         price: 19.99
 *         description: "This is a sample product."
 *         category: "electronics"
 *         inStock: 50
 */
