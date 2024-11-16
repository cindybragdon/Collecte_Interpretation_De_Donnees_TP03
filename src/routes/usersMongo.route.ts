import { Router } from 'express';
import { UserMongoController } from "../controllers/usersMongo.controller";


const router = Router();
const userMongoController = new UserMongoController();

/**
 * @swagger
 * /v2/users/register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     description: Enregistre un nouvel utilisateur dans la base de données MongoDB
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erreur de validation des données
 */



/**
 * @swagger
 * /v2/users/login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     description: Authentifie un utilisateur avec son email et son mot de passe
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse email de l'utilisateur
 *                 example: "utilisateur@example.com"
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Utilisateur authentifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Jeton JWT pour l'utilisateur authentifié
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Identifiants invalides
 */


router.post("/users/register", userMongoController.createNewUser);

router.post("/users/login", userMongoController.userLogin);

export default router;