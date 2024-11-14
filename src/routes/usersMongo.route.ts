import { Router } from "express";
import { UserMongoController } from "../controllers/usersMongo.controller";

const router = Router();
const usersMongoController = new UserMongoController();

// Version 2 de l'API

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - role
 *         - username
 *         - password
 *         - name
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique user ID
 *           example: 1
 *         email:
 *           type: string
 *           description: Adresse email validé de l'utilisateur,
 *           example: "utilisateur@example.com"
 *         role:
 *           type: string
 *           description: Rôle du user (gestionnaire ou employé)
 *           enum: [gestionnaire, employe]
 *           example: "gestionnaire"
 *         username:
 *           type: string
 *           description: Nom d'utilisateur unique
 *           example: "abc123"
 *         password:
 *           type: string
 *           description: Mot de passe de l'utilisateur
 *           example: "passwordabc"
 *         name:
 *           type: object
 *           properties:
 *             firstname:
 *               type: string
 *               description: Prénom de l'utilisateur
 *               example: "Noemie"
 *             lastname:
 *               type: string
 *               description: Nom de famille de l'utilisateur
 *               example: "Emile"
 *         phone:
 *           type: string
 *           description: Numéro de téléphone de l'utilisateur
 *           example: "+33123456789"
 */

/**
 * @swagger
 * /v2/users:
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
 *
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


router.post('/v2/users', usersMongoController.createNewUser);

router.post('/v2/users', usersMongoController.userLogin);


export default router;