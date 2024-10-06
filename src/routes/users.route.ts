import { Router } from "express";
import { UserController } from "../controllers/users.controller";
//import { roleMiddleware } from '../middlewares/roles.middleware';
//import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users from this API --> https://fakestoreapi.com/users
 *     description: Retrieve a list of users from the API. Can be used to populate a list of users in your system.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schemas:
 *     Geolocation:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *           description: Latitude of the user’s address
 *           example: 48.8566
 *         long:
 *           type: number
 *           description: Longitude of the user’s address
 *           example: 2.3522
 *     Address:
 *       type: object
 *       properties:
 *         geolocation:
 *           $ref: '#/components/schemas/Geolocation'
 *         city:
 *           type: string
 *           description: City name
 *           example: "Paris"
 *         street:
 *           type: string
 *           description: Street name
 *           example: "Champs-Élysées"
 *         number:
 *           type: number
 *           description: Street number
 *           example: 50
 *         zipcode:
 *           type: string
 *           description: Postal code
 *           example: "75008"
 *     Name:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *           description: First name
 *           example: "John"
 *         lastname:
 *           type: string
 *           description: Last name
 *           example: "Doe"
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The unique ID of the user
 *           example: 1
 *         email:
 *           type: string
 *           description: The user’s email address
 *           example: "miniwheat@example.com"
 *         role:
 *           type: string
 *           description: Role that gives acces to certains routes
 *           example: 'gestionnaire' | 'employe'
 *         username:
 *           type: string
 *           description: The user’s username
 *           example: "mwheat"
 *         password:
 *           type: string
 *           description: The user’s password
 *           example: "hungy_heart"
 *         name:
 *           $ref: '#/components/schemas/Name'
 *         phone:
 *           type: string
 *           description: Phone number
 *           example: "+1234567890"
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         __v:
 *           type: number
 *           description: Version key
 *           example: 0
 */
router.get("/users", userController.getAllUsers);
router.post("/users/register", userController.userConnected);
router.get("/users/login", userController.loginByEmail);

//router.get('/admin', verifyToken, roleMiddleware(['admin']), UserController.getAdminData);

export default router;
