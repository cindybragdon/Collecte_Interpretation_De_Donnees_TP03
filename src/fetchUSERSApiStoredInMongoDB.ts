import fetch from 'node-fetch';
import UserMongo from './models/userMongo.model';

interface User {
  id: number;
  email: string;
  role: 'gestionnaire' | 'employe';
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
}

interface UserMongoDocument {
  id: number;
  email: string;
  role: 'gestionnaire' | 'employe';
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
}

// Fetch des users sur l'API
const fetchUSERSApiStoredInMongoDB = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/users');
    const users: User[] = await response.json();

    console.log('Fetch Mongo : Utilisateurs récupérés depuis l\'API Fake Store :', users);

    // Validation des utilisateurs
    const validUsers: UserMongoDocument[] = users
      .map((user) => { // Renommé 'users' en 'user'
        if (!user.name.firstname || !user.password) {
          console.error('Fetch Mongo : Utilisateur incomplet:', user);
          return null;
        }

        // Format modèle MongoDB
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          username: user.username,
          password: user.password,
          name: {
            firstname: user.name.firstname,
            lastname: user.name.lastname,
          },
          phone: user.phone,
        };
      })
      .filter(Boolean) as UserMongoDocument[]; // Garder les utilisateurs valides

    // Push les utilisateurs valides dans MongoDB
    if (validUsers.length > 0) {
      await insertUsersToMongoDB(validUsers); 
    } else {
      console.log('Fetch Mongo : Aucun utilisateur valide à insérer.');
    }
  } catch (error) {
    console.error('Fetch Mongo : Erreur lors de la récupération des utilisateurs :', error);
  }
};

// Fonction push des utilisateurs dans MongoDB
const insertUsersToMongoDB = async (users: UserMongoDocument[]) => {
  try {
    // Delete Many vide la collection pour éviter les doublons
    await UserMongo.deleteMany({});
    // Insert all utilisateurs dans MongoDB
    await UserMongo.insertMany(users);
    console.log('Fetch Mongo : MongoDB peuplé de utilisateurs avec succès!');
  } catch (error) {
    console.error('Fetch Mongo : Erreur lors de la population des utilisateurs dans MongoDB :', error);
  }
};

export default fetchUSERSApiStoredInMongoDB;
