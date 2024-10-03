
import { Products } from '../interfaces/products.interface';
import { ProductsModel } from '../models/products.model';
import * as fs from 'fs';
import * as path from 'path';

//import { key } from '../services/auth.service';

export class ProductsService {
  
  public static findById(id: number) {
    return this.getAllProducts().then(products => products.filter(products => products.id === id)[0]);
  }

  public static async getAllProducts(): Promise<Products[]> {
    //const password = key.encrypt('password', 'base64');

    // Supposons que tu aies une URL d'API qui renvoie les utilisateurs au format JSON
    const productsFromApi = await fetch('https://fakestoreapi.com/products')
      .then(response => response.json());

    
      // Map des données récupérées depuis l'API à des instances de UsersModel
      const products = productsFromApi.map((product: Products) => {
        const minInStock = 0;
        const maxInStock = 100;
        const stock = Math.floor(Math.random() * (maxInStock - minInStock) + minInStock);
        
        return new ProductsModel(  // Ensure you return the new object
          product.id,
          product.title,     
          product.price, 
          product.description,
          product.category,
          stock
        );
      });
      
      

    //Populer le JSON avec productsData
    const productsData = JSON.stringify(products, null, 2);
    const dir = path.join(__dirname, '../../data');
    const filePath = path.join(dir, 'productsData.json');

    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }


      try {
        fs.writeFileSync(filePath, productsData);
        console.log('SERVICE : Le fichier productsData.json est populé par API FakeStore/products');
      }catch(err) {
        console.error('SERVICE : Erreur lors de lécriture de productsData dans productsData.json');
      }
        

    return products;
  }
}
