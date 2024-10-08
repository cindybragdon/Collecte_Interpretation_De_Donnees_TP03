// Le CONTROLLER est le point d'entrée des requêtes HTTP. Il reçoit
// les requêtes, vérifie les paramètres d'entrée (ex. l'ID du produit),
//  et utilise le service pour effectuer des opérations.
// Le contrôleur ne devrait pas contenir de logique métier complexe.
// Il devrait principalement déléguer les tâches au service.
// Par exemple, dans ton ProductsController, tu aurais une fonction
// qui récupère l'ID d'une requête, appelle la méthode findById
// du service, puis renvoie la réponse au client.

import { Request, Response } from "express";
import { UsersService } from "../services/users.service";
import { Users } from "../interfaces/users.interface";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
import * as fs from "fs";
import * as path from "path";
import { UsersModel } from "../models/users.model";
import { logger } from "../logger/winston.logger";

export class UserController {
  //*********************GET ALL USERS*******************//
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    console.log(req.headers);
    console.log("REFRESH BROWSER On est dans UserController");
    const users = await UsersService.getAllUsers();
    res.json(users);
  }

  //*********************REGISTER NEW USER*******************//
  public userConnected = async (req: Request, res: Response): Promise<void> => {
    const usersList: Users[] = Array.from(
      JSON.parse(
        fs.readFileSync("data/usersData.json", {
          encoding: "utf8",
          flag: "r",
        })
      )
    );
    const id = usersList.length + 1;
    //console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new UsersModel(
      req.body.adresse,
      id,
      req.body.email,
      req.body.role,
      req.body.username,
      hashedPassword,
      req.body.name,
      req.body.phone,
      req.body.__v
    );

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = (email: string): boolean => {
      return emailRegex.test(req.body.email);
    };

    if (isValidEmail(req.body.email)) {
      usersList.push(newUser);
      const usersListModified = JSON.stringify(usersList, null, 2);

      const filePath = path.join(__dirname, "../../data/usersData.json");
      //Si le répertoire n'existe pas, crée le
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      try {
        fs.writeFileSync(filePath, usersListModified);
        console.log(
          "UsersController : Le user a été créé avec succès dans usersData.json"
        );
        logger.info(`STATUS 201 : ${req.method} ${req.url}`);
        res.status(201).send("Utilisateur enregistré");
      } catch (err) {
        console.error(
          "UsersController : Erreur lors de lécriture du nouveau user dans usersData.json"
        );
      }
    }
  };
  //*********************LOGIN BY EMAIL AND ROLE*******************//
  public loginByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        res.status(400).json({
          message:
            "Veuillez renseigner tous les champs, email et mot de passe sont requis.",
        });
        return;
      }

      const user = await UsersService.findUserEmail(email);

      if (!user) {
        logger.error(`STATUS 401 : ${req.method} ${req.url}`);
        res.status(401).json({ message: "Connexion echouée" });
        return;
      }

      // Comparer le mot de passe req.body avec le mot de passe stocké dans usersData.json
      const isInputPasswordValid = await bcrypt.compare(
        password,
        user.password
      );

      //Si le mot de passe n'est pas valide
      if (!isInputPasswordValid) {
        logger.error(`STATUS 401 : ${req.method} ${req.url}`);
        res.status(401).json({ message: "Connexion echouée" });
        return;
      }

      //Si password valide, on génère un token JWT qui expire dans 1h
      const accessToken = jwt.sign({ user }, "VIOLETTE", {
        expiresIn: "1h",
      });

      // Réponse JSON incluant le token JWT
      logger.info(`STATUS 200 : ${req.method} ${req.url}`);
      res.status(200).json({ token: accessToken });
      return;
    } catch (error) {
      console.error("Erreur lors du login :", error);
      logger.error(`STATUS 500 : ${req.method} ${req.url}`);
      res.status(500).json({ message: "Erreur serveur" });
      return;
    }
  };
  public static async getAdminData(req: Request, res: Response): Promise<void> {
    res.json({ message: "Données réservées aux administrateurs." });
    return;
  }
}
