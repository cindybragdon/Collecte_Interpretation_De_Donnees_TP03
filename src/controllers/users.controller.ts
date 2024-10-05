// Le CONTROLLER est le point d'entrée des requêtes HTTP. Il reçoit 
// les requêtes, vérifie les paramètres d'entrée (ex. l'ID du produit),
//  et utilise le service pour effectuer des opérations.
// Le contrôleur ne devrait pas contenir de logique métier complexe. 
// Il devrait principalement déléguer les tâches au service.
// Par exemple, dans ton ProductsController, tu aurais une fonction 
// qui récupère l'ID d'une requête, appelle la méthode findById 
// du service, puis renvoie la réponse au client.

import { Request, Response } from 'express';
import { UserService } from '../services/users.service';


export class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    console.log('REFRESH BROWSER On est dans UserController');
    const users = await UserService.getAllUsers();
    res.json(users);
  }

  public static async getAdminData(req: Request, res: Response) {
    res.json({ message: 'Données réservées aux administrateurs.' });
  }
}