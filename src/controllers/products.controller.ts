import { Request, Response } from "express";
import { ProductsService } from "../services/products.service";
import { ProductsModel } from "../models/products.model";
import { Products } from "../interfaces/products.interface";
import * as fs from "fs";

export class ProductsController {
  //private productsService = new ProductsService();

  //*********************GET PRODUCTS*******************/
  //Methode async qui prend req et res et qui ne retourne rien. getAllProducts fait des appels async
  public getAllProducts = async (
    req: Request,
    res: Response
    //Promesse de traitement en attente
  ): Promise<void> => {
    console.log("on est dans products.controller" + req.params);

    try {
      //Extraction des parametres qui sont stockés dans req.params
      const { minPrice, maxPrice, minInStock, maxInStock } = req.query;

      //les param sont parsé dans le format nécessaire. Si non présent, ils sont undefined pour éviter les exceptions
      const minimumPriceValue = minPrice ? parseFloat(minPrice as string) : undefined;
      const maximumPriceValue = maxPrice ? parseFloat(maxPrice as string) : undefined;
      const minimumInStockValue = minInStock ? parseInt(minInStock as string) : undefined;
      const maximumInStockValue = maxInStock ? parseInt(maxInStock as string) : undefined;

      //Attend le retour de l'api et des manip faites sur le data
      //Envoie à getProductsFiltered() les param pris de API URL et convertis filtrés
      //*********************GET PRODUCTS FILTERED*******************/
      const product = await ProductsService.getProductsFiltered(
        minimumPriceValue,
        maximumPriceValue,
        minimumInStockValue,
        maximumInStockValue
      );
      
      res.status(200).json({message: "On est cool, ça passe! Les products sont filtrés ",product,});
      //tests console
      console.log("REFRESH BROWSER On est dans ProductsController");

    } catch (error) {
      res.status(500).json({ message: "Erreur lors du get des products filtrés" });
    }
  };

  //*********************POST NEW PRODUCT*******************/
  public postNewProduct = async (req: Request, res: Response): Promise<void> => {
    
      //Cueillette des éléments dans le body (Postman) (req.body)
      const { title, price, description, category, inStock } = req.body;
      
      const productsList:Products[] = Array.from(JSON.parse(fs.readFileSync('./data/productsData.json', { encoding: 'utf8', flag: 'r' })));
      let id = productsList.length+1;
      const titleRegex = /^.{3,50}$/;
      const priceRegex = /^[0-9]+(?:\.[0-9]+)?$/;
      const inStockRegex = /^(0|[1-9][0-9]*)$/;

      // Créer une nouvelle instance de ProductsModel avec les données fournies
      const newProduct = new ProductsModel(
        id,
        title,
        price,
        description,
        category,
        inStock
      );
      //401 Si le user n'est pas autorisé
      // if (AUCUNE IDÉE) {
      //   console.log('PRODUCTS CONTROLLER : 401 Vous nêtes pas autorisé à ajouter un produit')
      //   res.status(401).json({ message: "Vous n'êtes pas autorisé à ajouter un produit" });
      // }
      //400 Si il manque une donnée dans le request body
      if(!id || !title || !price || !description || !category || !inStock
         || !titleRegex.test(title) || !priceRegex.test(price) || !inStockRegex.test(inStock)
      ) {
        console.log('PRODUCTS CONTROLLER : 400 Veuillez renseigner tous les champs de tel que demandé')
        res.status(400).json({ message: "Veuillez renseigner tous les champs de tel que demandé" });
      }
      else{
        //Appel a ProductsService pour append le fichier productsData.json avec le nouveau produit
        await ProductsService.addNewProduct(newProduct);
        console.log('PRODUCTS CONTROLLER : 200 Le nouveau produit a été ajouté au fichier productsData.json')
        res.status(200).json({message: 'Le nouveau produit a été ajouté au fichier productsData.json'})
      }
  
  };


}
