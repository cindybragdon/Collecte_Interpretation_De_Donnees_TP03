import { Request, Response } from "express";
import { Products } from "../interfaces/products.interface";
import { ProductsModel } from "../models/products.model";
import { ProductsController } from "../controllers/products.controller";
import * as fs from "fs";
import * as path from "path";

//import { key } from '../services/auth.service';

export class ProductsService {

  //GET findById prend allProducts et retourne seulement ceux avec le id correspondant
  public static findById(id: number) {
    return this.getAllProducts().then(
      (products) => products.filter((products) => products.id === id)[0]
    );
  }

  //Elle prend tous les produits de l'API et les paramètres optionnels URL
  //Retourne un tableau de produits
  public static async getAllProducts(
    minPrice: number = 0,
    maxPrice: number = 10000000000000,
    minInStock: number = 0,
    maxInStock: number = 10000000000000
  ): Promise<Products[]> {
    //const password = key.encrypt('password', 'base64');


    // Map des données récupérées depuis l'API à des instances de UsersModel
    //On crée des instances de Products en prenant les Products de API et en ajoutant un attibut
    const productsList:Products[] = Array.from(JSON.parse(fs.readFileSync('./data/productsData.json', { encoding: 'utf8', flag: 'r' })));
    const products = productsList.map((product: Products) => {
      const minInStock = 0;
      const maxInStock = 500;
      const stock = Math.floor(Math.random() * (maxInStock - minInStock) + minInStock);

      return new ProductsModel( // Nouveau modele avec le stock en plus
        product.id,
        product.title,
        product.price,
        product.description,
        product.category,
        stock
      );

    });
    return products;
  }

  //GET les produits filtrés
  public static async getProductsFiltered(
    minPrice?: number,
    maxPrice?: number,
    minInStock?: number,
    maxInStock?: number
  ): Promise<ProductsModel[]> {
    //On va chercher tous les produits de API afin quils soient filtré
    const products = await this.getAllProducts();

    //On filtre les produits selon les params entrés en url
    return products.filter((product) => {

      return (
        //retourne SI le minPrice est undefined OU si le product.price est plus grand ou = au minPrice ET
        (minPrice === undefined || product.price >= minPrice) &&
        //SI le maxPrice est undefined OU si le product.price est plus petit ou = au maxPrice ET
        (maxPrice === undefined || product.price <= maxPrice) &&
        // SI le minStock est undefined OU si le product.inStock est plus grand ou = au minInStock ET
        (minInStock === undefined || product.inStock >= minInStock) &&
        //SI le maxStock est undefined OU si le product.inStock est plus petit ou = au maxInStock ET
        (maxInStock === undefined || product.inStock <= maxInStock)
      );
    });
  }

    public static async addNewProduct(newProduct: ProductsModel): Promise<void> {
      const filePath = path.join(__dirname, "../../data/productsData.json");
  
      try {
        // Lire le fichier JSON existant
        const productsList: Products[] = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
  
        // Ajouter le nouveau produit à la liste
        productsList.push(newProduct);
  
        // Écrire la nouvelle liste dans le fichier JSON
        fs.writeFileSync(filePath, JSON.stringify(productsList, null, 2));
  
        console.log("SERVICE POST : Le nouveau produit a été ajouté au fichier productsData.json");
  
      } catch (error) {
        console.error("SERVICE POST : Erreur lors de l'ajout du nouveau produit au fichier productsData.json", error);
        throw error;
      }
    }
  }


  

