import { Router } from "express";
import { UserController } from "../controllers/users.controller";
//import { roleMiddleware } from '../middlewares/roles.middleware';
//import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();
