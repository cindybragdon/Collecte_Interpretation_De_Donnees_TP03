import { Router } from 'express';
import { ProductsMongoController } from '../controllers/productsMongo.controller';

const router = Router();
const productMongoController = new ProductsMongoController();

// Version 2 de l'API


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du produit
 *           example: 1
 *         title:
 *           type: string
 *           description: Titre du produit
 *           minLength: 3
 *           maxLength: 50
 *           example: "Produit A"
 *         description:
 *           type: string
 *           description: Description du produit
 *           example: "Description du produit A"
 *         category:
 *           type: string
 *           description: Catégorie du produit
 *           example: "Électronique"
 *         quantity:
 *           type: integer
 *           description: Quantité en stock (entier positif ou zéro)
 *           default: 0
 *           example: 10
 *         price:
 *           type: integer
 *           description: Prix du produit (entier positif ou zéro)
 *           example: 100
 *         image:
 *           type: string
 *           description: URL de l'image du produit
 *           example: "https://example.com/image.jpg"
 *         rating:
 *           type: object
 *           properties:
 *             rate:
 *               type: number
 *               description: Note du produit
 *               example: 4.5
 *             count:
 *               type: integer
 *               description: Nombre d'avis pour le produit
 *               example: 100
 */

/**
 * @swagger
 * /v2/products:
 *   get:
 *     summary: Obtenir tous les produits
 *     description: Récupère une liste de tous les produits dans la base de données MongoDB
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Créer un nouveau produit
 *     description: Ajoute un nouveau produit dans la base de données MongoDB
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Erreur de validation des données
 *
 * /v2/products{id}:
 *   put:
 *     summary: Mettre à jour un produit
 *     description: Met à jour les informations d'un produit existant dans la base de données MongoDB
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du produit à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 *       400:
 *         description: Erreur de validation des données
 *
 *   delete:
 *     summary: Supprimer un produit
 *     description: Supprime un produit existant de la base de données MongoDB
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du produit à supprimer
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       404:
 *         description: Produit non trouvé
 */

router.get('/v2/products', productMongoController.getAllProductsMongo);

router.post('/v2/products', productMongoController.postNewProduct);

router.put('/v2/products:id', productMongoController.putUpdateProduct);

router.delete('/v2/products:id', productMongoController.deleteProduct);

export default router;