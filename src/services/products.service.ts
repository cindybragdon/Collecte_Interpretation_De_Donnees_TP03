
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
    // const users = usersFromApi.map((user: any) => new UsersModel(
    //   {
    //     geolocation: {
    //       lat: user.address.geolocation.lat,
    //       long: user.address.geolocation.long
    //     },
    //     city: user.address.city,
    //     street: user.address.street,
    //     number: user.address.number,
    //     zipcode: user.address.zipcode
    //   },
    //   user.id,
    //   user.email, 
    //   user.username, 
    //   "password", 
    //   {
    //     firstname: user.name.firstname,
    //     lastname: user.name.lastname
    //   },
    //   user.phone, 
    //   user.__v 
    // ));


    //Populer le JSON avec usersData
    const usersData = JSON.stringify(productsFromApi, null, 2);
    const dir = path.join(__dirname, '../../data');
    const filePath = path.join(dir, 'productsData.json');

    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }


      try {
        fs.writeFileSync(filePath, usersData);
        console.log('Le fichier productsData.json est populé par API FakeStore');
      }catch(err) {
        console.error('Erreur lors de lécriture de productsData dans productsData.json');
      }
        

    return productsFromApi;
  }
}
