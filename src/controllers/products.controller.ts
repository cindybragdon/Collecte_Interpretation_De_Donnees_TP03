import { Request, Response } from 'express';
import { ProductsService } from '../services/products.service';


export class ProductsController {
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    console.log('REFRESH BROWSER On est dans ProductsController');
    const products = await ProductsService.getAllProducts();
    res.json(products);
  }

  
}