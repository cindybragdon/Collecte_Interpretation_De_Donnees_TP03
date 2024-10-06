// Le SERVICE contient la logique métier (business logic), c'est-à-dire
// les opérations qui manipulent directement les données ou les 
// exécutent. Le service est responsable d'effectuer des actions telles
// que accéder aux bases de données, lire/écrire dans des fichiers, 
// ou effectuer des transformations sur les données.Exemplle, la 
//fonction findById appartient au service car elle contient la logique 
//de récupération des produits et de leur filtrage basé sur l'ID.

import { Request, Response } from "express";
import { Products } from "../interfaces/products.interface";
import { ProductsModel } from "../models/products.model";
import { ProductsController } from "../controllers/products.controller";
import * as fs from "fs";
import * as path from "path";
import { error } from "console";


export class ProductsService {

  //*********************GET ALL PRODUCTS*******************//
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

    //*********************GET PRODUCTS FILTERED*******************//
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


    //*********************POST NEW PRODUCT*******************//
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

    //*********************GET PRODUCT BY ID*******************//
    public static async findById(id: number): Promise<ProductsModel | undefined> {
      try {
        const products = await this.getAllProducts();
        const product = products.find((product) => product.id === id);
        
        if (!product) {
          console.log(`Le produit ayant l'ID ${id} n'existe pas dans productsData.json.`);
        }
        return product;
      } catch (error) {
        console.error(`Erreur lors de la récupération du produit ayant l'ID ${id}`, error);
        throw error;
      }
    }

    //*********************PUT UPDATE PRODUCT BY ID*******************//
    public static async updateProduct(
      id: number,
      updatesPost: { title?: string; description?: string; price?: number; inStock?: number }
    ): Promise<ProductsModel | null> {  
      const filePath = path.join(__dirname, "../../data/productsData.json");
    
      // Recherche du produit dans le JSON
      const productJson = await this.findById(id);
    
      if (!productJson) {
        console.log(`Le produit ayant l'ID ${id} n'existe pas dans productsData.json`);
        return null;
      }
    
      // Vérification des updates
      if (updatesPost.price !== undefined && updatesPost.price <= 0) {
        throw new Error('Entrez un prix plus grand que 0');
      }
      if (updatesPost.inStock !== undefined && updatesPost.inStock < 0) {
        throw new Error('Entrez une quantité supérieure ou égale à 0');
      }
    
      // Application des mises à jour
      if (updatesPost.title !== undefined) {
        productJson.title = updatesPost.title;
      }
      if (updatesPost.price !== undefined) {
        productJson.price = updatesPost.price;
      }
      if (updatesPost.description !== undefined) {
        productJson.description = updatesPost.description;
      }
      if (updatesPost.inStock !== undefined) {
        productJson.inStock = updatesPost.inStock;
      }
    
      // Lecture et mise à jour de productsData.json
      const listOfProducts: Products[] = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
      const updatedProductsList = listOfProducts.map((prd) => (prd.id === id ? productJson : prd));
    
      // Écriture des mises à jour dans le fichier
      fs.writeFileSync(filePath, JSON.stringify(updatedProductsList, null, 2));
    
      return productJson;

  }
      ///*********************DELETE PRODUCT BY ID*******************//
public static async deleteProductById(
  idBody: number,
  deleteThis: { title?: string; description?: string; price?: number; inStock?: number }
): Promise<ProductsModel | null> {  
  const filePath = path.join(__dirname, "../../data/productsData.json");

  // Lire le fichier JSON existant
  const productsList: Products[] = Array.from(JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })));

  // Trouver le produit à supprimer par ID
  const productJsonToDelete = await this.findById(idBody);

  // Vérifiez si le produit existe et sil n'existe pas, erreur
  if (!productJsonToDelete) {
    console.log(`Vous ne pouvez retirer le produit ayant l'ID ${idBody}, il n'existe pas dans productsData.json`);
    return null;
  }

  // Utilisez l'ID du produit trouvé pour la suppression
  const indexOfProductToDelete = productsList.findIndex(product => product.id === idBody);
  
  if (indexOfProductToDelete === -1) {
    console.log(`Le produit avec l'ID ${idBody} n'a pas été trouvé dans la liste.`);
    return null;
  }

  // Retirer le produit de la liste
  productsList.splice(indexOfProductToDelete, 1);

  // Écrire la nouvelle liste dans le fichier JSON
  fs.writeFileSync(filePath, JSON.stringify(productsList, null, 2));

  console.log(`Vous avez retiré le produit ayant l'ID ${idBody} de productsData.json`);
  
  return productJsonToDelete; 
}

  
}
