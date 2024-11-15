import { JWT_SECRET } from "../../src/utils/jwt.util";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../src/models/userMongo.model'; 

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/index");

require("dotenv").config();

// Avant tous les tests : config In Memory MongoDB et connecte Mongoose
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });
  
// Avant tous les tests : config In Memory MongoDB et connecte Mongoose
afterEach(async () => {
    await mongoose.connection.close();
  });


    //*********************CREATE NEW USER*******************//
  describe("POST /v2/users/register", () => {
    it("should create a user", async () => {
      const res = await request(app).post("/v2/users/register").send({
        email: "miniwheat@gmail.com",
          role: 'gestionnaire',
          username: 'miniwheat',
          password: 'jmNoemie',
          name: {
            firstname: 'Mini',
            lastname: 'Wheat',
          },
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.email).toBe("miniwheat@gmail.com");
    });
  });


  describe("POST /v2/users/register", () => {
    it("should return a status 400 error", async () => {
      const res = await request(app).post("/v2/users/register").send({
        email: "miniwheat@gmail.com",
          role: 'gestionnaire',
          username: 'miniwheat',
          password: 'jmNoemie',
          name: {
            firstname: 'Mini',
            lastname: 'Wheat',
          },
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "UserMongoController : Erreur inconnue lors de la création de l'utilisateur"  })
        )});
    });


      //*********************LOGIN USER*******************//
      describe('POST /users/login', () => {
        it('should login with success and return status 200 if credentials are correct', async () => {
          const password = 'jmNoemie';
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = new User({
            email: 'miniwheat@gmail.com',
            role: 'gestionnaire',
            username: 'miniwheat',
            password: hashedPassword,
            name: {
              firstname: 'Mini',
              lastname: 'Wheat',
            },
          });
          await user.save();
      
          const res = await request(app).post('/users/login').send({
            email: 'miniwheat@gmail.com',
            password: 'jmNoemie',
          });
      
          expect(res.statusCode).toBe(200);
          expect(res.body.token).toBeDefined();
      
          const decoded = jwt.verify(res.body.token, JWT_SECRET) as jwt.JwtPayload;
          expect(decoded).toMatchObject({ user: { email: 'miniwheat@gmail.com' } });
        });
      });


      it('should return status 400 if credentials are missing or wrong', async () => {
        const res = await request(app).post('/users/login').send({
          email: '',
          password: '',
        });
      
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Veuillez renseigner tous les champs, email et mot de passe sont requis.");
      });


  /** 
  describe("GET /api/products/:id", () => {
    it("should return a product", async () => {
      const res = await request(app).get(
        "/api/products/6331abc9e9ececcc2d449e44"
      );
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Product 1");
    });
  });
  
  describe("POST /api/products", () => {
    it("should create a product", async () => {
      const res = await request(app).post("/api/products").send({
        name: "Product 2",
        price: 1009,
        description: "Description 2",
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("Product 2");
    });
  });
  
  describe("PUT /api/products/:id", () => {
    it("should update a product", async () => {
      const res = await request(app)
        .patch("/api/products/6331abc9e9ececcc2d449e44")
        .send({
          name: "Product 4",
          price: 104,
          description: "Description 4",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(104);
    });
  });
  
  describe("DELETE /api/products/:id", () => {
    it("should delete a product", async () => {
      const res = await request(app).delete(
        "/api/products/6331abc9e9ececcc2d449e44"
      );
      expect(res.statusCode).toBe(200);
    
  });*/