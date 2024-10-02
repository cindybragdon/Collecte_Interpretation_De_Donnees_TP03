import { Request, Response } from 'express';
import { ProductsService } from '../services/products.service';


export class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await ProductsService.getAllProducts();
    res.json(users);
  }

  
}