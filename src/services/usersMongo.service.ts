import UserSchema from '../models/userMongo.model'; 
import { IUserMongo } from '../interfaces/usersMongo.interface';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/jwt.util';

export class UsersMongoService {

  //*********************CREATE NEW USER*******************//
  public static async createNewUser(userData: IUserMongo): Promise<IUserMongo> {
    try {
      // Hachage du mot de passe avant de sauvegarder l'utilisateur
      return await new UserSchema(userData).save();
    } catch (error) {
      console.log("Erreur lors de la création de l'utilisateur :", error);
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  }

  //*********************FIND USER BY EMAIL*******************//
  public static async findUserByEmail(email: string) {
    try {
      return await UserSchema.findOne({ email });
    } catch (error) {
      console.log("Erreur lors de la recherche de l'utilisateur par email :", error);
      throw new Error("Erreur lors de la recherche de l'utilisateur");
    }
  }

  //*********************GENERATE JWT TOKEN*******************//
  
static generateToken(user: { _id: string; role: string }): string {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
}

}
