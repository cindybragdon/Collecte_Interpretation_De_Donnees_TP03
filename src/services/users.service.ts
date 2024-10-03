
import { Users } from '../interfaces/users.interface';
import { UsersModel } from '../models/users.model';
import * as fs from 'fs';
import * as path from 'path';

//import { key } from '../services/auth.service';

export class UserService {
  
  public static findByEmail(email: string) {
    return this.getAllUsers().then(users => users.filter(user => user.email === email)[0]);
  }

  public static async getAllUsers(): Promise<Users[]> {
    //const password = key.encrypt('password', 'base64');
      
    // Supposons que tu aies une URL d'API qui renvoie les utilisateurs au format JSON
    const usersFromApi = await fetch('https://fakestoreapi.com/users')
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
    const usersData = JSON.stringify(usersFromApi, null, 2);
    const dir = path.join(__dirname, '../../data');
    const filePath = path.join(dir, 'usersData.json');

    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }


      try {
        fs.writeFileSync(filePath, usersData);
        console.log('SERVICE : Le fichier usersData.json est populé par API FakeStore/users');
      }catch(err) {
        console.error('SERVICE : Erreur lors de lécriture de usersData dans usersData.json');
      }
        

    return usersFromApi;
  }
}
