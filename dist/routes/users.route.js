"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const router = (0, express_1.Router)();
const userController = new users_controller_1.UserController();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: FakeStore management API
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Fetch a list of users from the API or local database.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users", userController.getAllUsers);
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user and save their details.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post("/users/register", userController.userConnected);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user by email and password.
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
 *                 description: User's email.
 *                 example: "miniwheat@example.com"
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: "hungy_heart"
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       401:
 *         description: Unauthorized.
 */
router.post("/users/login", userController.loginByEmail);
exports.default = router;
/**
 * @swagger
 * components:
 *   schemas:
 *     Geolocation:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *           description: Latitude of the user's address.
 *           example: 48.8566
 *         long:
 *           type: number
 *           description: Longitude of the user's address.
 *           example: 2.3522
 *     Address:
 *       type: object
 *       properties:
 *         geolocation:
 *           $ref: '#/components/schemas/Geolocation'
 *         city:
 *           type: string
 *           description: City name.
 *           example: "Paris"
 *         street:
 *           type: string
 *           description: Street name.
 *           example: "Champs-Élysées"
 *         number:
 *           type: number
 *           description: Street number.
 *           example: 50
 *         zipcode:
 *           type: string
 *           description: Postal code.
 *           example: "75008"
 *     Name:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *           description: First name.
 *           example: "John"
 *         lastname:
 *           type: string
 *           description: Last name.
 *           example: "Doe"
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
 *         - address
 *       properties:
 *         id:
 *           type: number
 *           description: The unique ID of the user.
 *           example: 1
 *         email:
 *           type: string
 *           description: User's email address.
 *           example: "miniwheat@example.com"
 *         role:
 *           type: string
 *           description: User's role, either 'gestionnaire' or 'employe'.
 *           example: "gestionnaire"
 *         username:
 *           type: string
 *           description: The user's username.
 *           example: "mwheat"
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: "hungy_heart"
 *         name:
 *           $ref: '#/components/schemas/Name'
 *         phone:
 *           type: string
 *           description: Phone number.
 *           example: "+1234567890"
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         __v:
 *           type: number
 *           description: Version key.
 *           example: 0
 */
