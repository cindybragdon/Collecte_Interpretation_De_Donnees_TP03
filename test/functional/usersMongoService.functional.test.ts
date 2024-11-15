import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../src/models/userMongo.model';
import { UsersMongoService } from '../../src/services/usersMongo.service';
import { JWT_SECRET } from '../../src/utils/jwt.util';


import UserSchema from '../../src/models/userMongo.model';
// Mock du modèle User pour simuler les requêtes MongoDB
jest.mock('../../src/models/userMongo.model');

// Config pour In-Memory MongoDB
let mongoServer: MongoMemoryServer;

// Avant tous les tests : config In Memory MongoDB et connecte Mongoose
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = await mongoServer.getUri();
  await mongoose.connect(uri);
  //verifyToken()
});

// Après tous les tests : déconnecte Mongoose et stop serveur In Memory MongoDB
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Après chaque test : Supprime et nettoie la collection User
afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model Tests', () => {
  

  //********************* CREATE NEW USER WITH MOCK *******************//
  test('should create a new user with hashed password', async () => {
    const mockUser = {id:1, email:'miniwheat@gmail.com',role:'gestionnaire',username:'Mini Wheat', password:'jmNoemie', name:{    firstname: "llo",lastname: "yo"}, phone:"450-334-4353"};
    const mockUserData = new UserSchema();
    const hashedPassword = await bcrypt.hash(mockUserData.password, 10);

    // Mock de save pour simuler l'enregistrement d'un user
    (User.prototype.save as jest.Mock).mockResolvedValue({
      ...mockUserData,
      password: hashedPassword,
    });

    const result = await UsersMongoService.createNewUser(mockUserData);

    // Vérifie que le mot de passe est bien haché
    expect(result.password).toBe(hashedPassword);
    expect(bcrypt.compareSync(mockUserData.password, result.password)).toBe(true);
  });


  //********************* FIND USER BY EMAIL WITH MOCK *******************//
  test('should return user by email', async () => {
    const mockUser = { _id: '1', name: 'Mini Wheat', email: 'miniwheat@gmail.com', role: 'gestionnaire' };

    // Mock de findOne pour simuler la recherche d'un utilisateur par email
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await UsersMongoService.findUserByEmail('miniwheat@gmail.com');

    // Vérifie que le résultat est bien celui attendu
    expect(result).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ email: 'miniwheat@gmail.com' });
  });

  
  //********************* GENERATE JWT TOKEN WITH MOCK *******************//
  test('should generate a JWT token with correct payload and expiration', () => {
    const mockUser = { _id: '123456789', role: 'gestionnaire' };


    const token = UsersMongoService.generateToken(mockUser);
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    // Vérifie que le token contient les bonnes informations
    expect(decoded.id).toBe(mockUser._id);
    expect(decoded.role).toBe(mockUser.role);
    expect(decoded.exp).toBeDefined();
  });
});
