import fetch from "node-fetch";
import UserSchema from "./models/userMongo.model";

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  role: string; 
  phone?: string;
}

interface UserMongoDocument {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  role: string;
  phone?: string;
}

const fetchUSERSApiStoredInMongoDB = async () => {
  try {
    console.log("Fetch Mongo Users : Démarrage du fetch des utilisateurs depuis l'API Fake Store.");

    const response = await fetch("https://fakestoreapi.com/users");
    if (!response.ok) {
      throw new Error(`Fetch Mongo Users : Erreur lors de la récupération de l'API Fake Store (${response.status})`);
    }

    const users: User[] = await response.json();

    //console.log("Fetch Mongo Users : Voici les utilisateurs récupérés depuis l'API Fake Store avant validation :", users);

    // Validation des utilisateurs
    const validUsers: UserMongoDocument[] = users
      .map((user) => {
        if (!user.email || !user.password || !user.name.firstname || !user.name.lastname) {
          //console.error("Fetch Mongo Users : Utilisateur incomplet :", user);
          return null;
        }

        // Format modèle MongoDB
        return {
          id: user.id,
          email: user.email,
          username: user.username || "", // Valeur par défaut si non fourni
          password: user.password, // Assurez-vous que ce mot de passe sera hashé dans une étape ultérieure
          name: {
            firstname: user.name.firstname,
            lastname: user.name.lastname,
          },
          role: user.role || "employe", // Par défaut, attribuez un rôle
          phone: user.phone || "",
        };
      })
      .filter(Boolean) as UserMongoDocument[]; // Garder les utilisateurs valides

    console.log(`Fetch Mongo Users : ${validUsers.length} utilisateurs valides trouvés.`);

    if (validUsers.length > 0) {
      await UserSchema.deleteMany({}); // Vider la collection MongoDB
      console.log("Fetch Mongo Users : Collection MongoDB vidée.");
      await UserSchema.insertMany(validUsers)
        .then((result) => {
          //console.log("Utilisateurs insérés avec succès :", result);
        })
        .catch((err) => {
          //console.error("Erreur d'insertion dans MongoDB :", err);
        });
    }
  } catch (error) {
    //console.error("Fetch Mongo Users : Erreur générale :", error);
  }
};

export default fetchUSERSApiStoredInMongoDB;
