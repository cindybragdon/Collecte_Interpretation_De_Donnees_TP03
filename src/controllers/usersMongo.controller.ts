import { Request, Response } from 'express';
import { UsersMongoService } from '../services/usersMongo.service';
import { logger } from '../logger/winston.logger';
import { JWT_SECRET } from '../utils/jwt.util';

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export class UserMongoController {
  //*********************CREATE NEW USERS*******************//
  public async createNewUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await UsersMongoService.createNewUser(req.body);
      logger.info(`STATUS 201 : ${req.method} ${req.url}`);
      res.status(201).json({
        message: "UserMongoController : Utilisateur ajouté avec succès",
        user: newUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        res.status(400).json({ message: error.message });
      } else {
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        res.status(400).json({ message: "UserMongoController : Erreur inconnue lors de la création de l'utilisateur" });
      }
    }
  }  

  //*********************LOGIN USER*******************//
  public async userLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        res.status(400).json({
          message: "Veuillez renseigner tous les champs, email et mot de passe sont requis.",
        });
        return;
      }

      const user = await UsersMongoService.findUserByEmail(email);

      if (!user) {
        logger.error(`STATUS 401 : ${req.method} ${req.url}`);
        res.status(401).json({ message: "Connexion échouée" });
        return;
      }

      const isInputPasswordValid = await bcrypt.compare(password, user.password);

      if (!isInputPasswordValid) {
        logger.error(`STATUS 401 : ${req.method} ${req.url}`);
        res.status(401).json({ message: "Connexion échouée" });
        return;
      }

      // Utilisation de jsonwebtoken pour signer le jeton
      const accessToken = jwt.sign({ user }, JWT_SECRET, {
        expiresIn: "1h",
      });

      logger.info(`STATUS 200 : ${req.method} ${req.url}`);
      res.status(200).json({ token: accessToken });
    } catch (error) {
      console.error("Erreur lors du login :", error);
      logger.error(`STATUS 500 : ${req.method} ${req.url}`);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
}
