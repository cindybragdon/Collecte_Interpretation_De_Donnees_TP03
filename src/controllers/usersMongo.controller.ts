import { Request, Response } from 'express';
import { UsersMongoService } from '../services/usersMongo.service';
import { logger } from '../logger/winston.logger';
import { JWT_SECRET } from '../utils/jwt.util';
import UserSchema from '../models/userMongo.model'; 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verifyIfUserMongoIsValid } from '../models/userMongo.model';


export class UserMongoController {
  //*********************CREATE NEW USER*******************//
  public async createNewUser(req: Request, res: Response): Promise<void> {
    try {

      if(!verifyIfUserMongoIsValid(req.body)) {
        logger.info(`STATUS 400 : ${req.method} ${req.url}`);
        res.status(400).json({message: "UserMongoController : Utilisateur non ajoute"});
        return ;
      }

      const newUser = new UserSchema(req.body);
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      newUser.password = hashedPassword;
      
      await UsersMongoService.createNewUser(newUser);

      logger.info(`STATUS 201 : ${req.method} ${req.url}`);
      res.status(201).json({
        message: "UserMongoController : Utilisateur ajouté avec succes",
        user: newUser,
      });


    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        res.status(400).json({ message: error.message });
      } else {
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        res.status(400).json({ message: "UserMongoController : Erreur inconnue lors de la creation de l'utilisateur" });
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
        res.status(401).json({ message: "Connexion echouee" });
        return;
      }

      const isInputPasswordValid = await bcrypt.compare(password, user.password);

      if (!isInputPasswordValid) {
        logger.error(`STATUS 401 : ${req.method} ${req.url}`);
        res.status(401).json({ message: "Connexion echouee" });
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
