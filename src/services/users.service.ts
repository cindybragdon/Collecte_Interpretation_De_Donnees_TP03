import { Users } from "../interfaces/users.interface";
import { UsersModel } from "../models/users.model";
import * as fs from 'fs';
import * as generator from 'generate-password';

export class UsersService {
  //*********************GET ALL USERS PLUS GENERATED PASSWORD*******************//
  public static async getAllUsers(): Promise<Users[]> {
  
    // Charger les données utilisateur à partir d'un fichier JSON
const usersList: Users[] = Array.from(JSON.parse(fs.readFileSync('./data/usersData.json', { encoding: 'utf8', flag: 'r' })));

  // Mapper les données récupérées depuis l'API à des instances de UsersModel en ajoutant un passeword généré
const users = usersList.map((user: Users) => {
  return new UsersModel(
    {
      geolocation: {
        lat: user.address.geolocation.lat,
        long: user.address.geolocation.long
      },
      city: user.address.city,
      street: user.address.street,
      number: user.address.number,
      zipcode: user.address.zipcode
    },
    user.id,
    user.email,
    user.username,
    user.password, 
    {
      firstname: user.name.firstname,
      lastname: user.name.lastname
    },
    user.phone,
    user.__v
  );
});

return users;
}

    //*********************GET USER BY EMAIL*******************//
    public static async findUserEmail(email: string): Promise<UsersModel | undefined> {
      try {
        const users = await this.getAllUsers();
        const user = users.find((user) => user.email === email);
        
        if (!email) {
          console.log(`Le email ${email} n'existe pas dans usersData.json.`);
        }
        return user;
      } catch (error) {
        console.error(`Erreur lors de la récupération du email ${email}`, error);
        throw error;
      }
    }
}
