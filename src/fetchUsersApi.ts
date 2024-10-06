//import * as fs from "fs";
import * as path from "path";
import { UsersModel } from "./models/users.model";
import { Users } from "./interfaces/users.interface";

const fs = require('fs')

export async function fetchUsersFromAPi() {
  // Fetch API qui renvoie les utilisateurs au format JSON
  const usersFromApi = await fetch("https://fakestoreapi.com/users").then((response) => response.json());

  //Populer le JSON avec productsData
  //const productsData = JSON.stringify(products, null, 2);
  const usersData = JSON.stringify(usersFromApi, null, 2);
  const filePath = path.join(__dirname, "data/usersData.json");
  //Si le répertoire n'existe pas, crée le
  //if (!fs.existsSync(filePath)) {
  //  fs.mkdirSync(filePath, { recursive: true });
 // }

 const userList: Users[] = JSON.parse(usersData);
 const users = userList.map((user: UsersModel) => {
  const roleEmploye: 'employe' = "employe"; 
  const roleGestionnaire: 'gestionnaire' = "gestionnaire"; 
  const role: 'gestionnaire' | 'employe' = user.id % 3 === 0 ? roleGestionnaire : roleEmploye; 
  return new UsersModel(
    {
      geolocation: {
        lat: user.address.geolocation.lat,
        long: user.address.geolocation.long,
      },
      city: user.address.city,
      street: user.address.street,
      number: user.address.number,
      zipcode: user.address.zipcode,
    },
    user.id,
    user.email,
    role,
    user.username,
    user.password,
    {
      firstname: user.name.firstname,
      lastname: user.name.lastname,
    },
    user.phone,
    user.__v
  )});
  try {

    //console.log(users)
    fs.writeFileSync('data/usersData.json', JSON.stringify(users, null, 2));
    
    console.log("FETCH USER : Le fichier usersData.json est populé par API FakeStore/users");
  } catch (err) {
    console.error(
      "SERVICE : Erreur lors de lécriture de usersData dans usersData.json"
    );
  }
}
