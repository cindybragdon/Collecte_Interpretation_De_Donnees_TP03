import { Request, Response } from "express";
import { ProductsService } from "../services/products.service";
import { ProductsModel } from "../models/products.model";
import { Products } from "../interfaces/products.interface";
import * as fs from "fs";
import { logger } from "../logger/winston.logger";

export class ProductsController {
  //*********************GET ALL PRODUCTS*******************//
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
      const minimumPriceValue = minPrice
        ? parseFloat(minPrice as string)
        : undefined;
      const maximumPriceValue = maxPrice
        ? parseFloat(maxPrice as string)
        : undefined;
      const minimumInStockValue = minInStock
        ? parseInt(minInStock as string)
        : undefined;
      const maximumInStockValue = maxInStock
        ? parseInt(maxInStock as string)
        : undefined;

      //Attend le retour de l'api et des manip faites sur le data
      //Envoie à getProductsFiltered() les param pris de API URL et convertis filtrés
      //*********************GET PRODUCTS FILTERED*******************//
      const product = await ProductsService.getProductsFiltered(
        minimumPriceValue,
        maximumPriceValue,
        minimumInStockValue,
        maximumInStockValue
      );

      logger.info(`${req.method} ${req.url}`);
      res.status(200).json({
        message: "On est cool, ça passe! Les products sont filtrés ",
        product,
      });
      //tests console
      console.log("REFRESH BROWSER On est dans ProductsController");
    } catch (error) {
      console.log(error);
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);

      res
        .status(400)
        .json({ message: "Erreur lors du get des products filtrés" });
    }
  };

  //*********************POST NEW PRODUCT*******************//
  public postNewProduct = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    //Cueillette des éléments dans le body (Postman) (req.body)
    const { title, price, description, category, inStock } = req.body;

    const productsList: Products[] = Array.from(
      JSON.parse(
        fs.readFileSync("./data/productData.json", {
          encoding: "utf8",
          flag: "r",
        })
      )
    );
    let id = productsList.length + 1;
    const titleRegex = /^.{3,50}$/;
    const priceRegex = /^[0-9]+(?:\.[0-9]+)?$/;
    const inStockRegex = /^(0|[1-9][0-9]*)$/;

    console.log(
      "id" +
        id +
        "title" +
        title +
        "price" +
        price +
        "description" +
        description +
        "categroy" +
        category +
        "inStock" +
        inStock
    );
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
    if (
      !id ||
      !title ||
      !price ||
      !description ||
      !category ||
      !inStock ||
      !titleRegex.test(title) ||
      !priceRegex.test(price) ||
      !inStockRegex.test(inStock)
    ) {
      console.log(
        "PRODUCTS CONTROLLER : 400 Veuillez renseigner tous les champs de tel que demandé"
      );
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      res.status(400).json({
        message: "Veuillez renseigner tous les champs de tel que demandé",
      });
    } else {
      //Appel a ProductsService pour append le fichier productsData.json avec le nouveau produit
      await ProductsService.addNewProduct(newProduct);
      console.log(
        "PRODUCTS CONTROLLER : 200 Le nouveau produit a été ajouté au fichier productsData.json"
      );
      logger.info(`STATUS 200: ${req.method} ${req.url}`);
      res.status(200).json({
        message: "Le nouveau produit a été ajouté au fichier productsData.json",
      });
    }
  };

  //*********************GET/PUT PRODUCT BY ID*******************//
  public putProduct = async (req: Request, res: Response): Promise<void> => {
    // Cueillette des éléments dans le body (Postman) (req.body)
    const { title, price, description, inStock } = req.body;

    // Ici on vérifie si on peut convertir le id en int.
    // Si il s'agit de chiffre, tout sera cool.  Sinon, ça retourne isNaN
    const idBody = parseInt(req.params.id);

    // 401 Si le user n'est pas autorisé
    // if (AUCUNE IDÉE) {
    //   console.log('PRODUCTS CONTROLLER : 401 Vous n\'êtes pas autorisé à ajouter un produit')
    //   res.status(401).json({ message: "Vous n'êtes pas autorisé à ajouter un produit" });
    // }

    if (isNaN(idBody) || !idBody) {
      console.log("CONTROLLER : L ID entré doit être un entier");
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      res.status(400).json({
        message: "Veuillez renseigner tous les champs tels que demandés",
      });
      return;
    }

    // Recherche du produit dans le JSON
    const productJson = await ProductsService.findById(idBody);

    if (!productJson) {
      console.log(
        "CONTROLLER POST : L ID que vous avez entré n existe pas dans le fichier productsData.json"
      );
      logger.error(`STATUS 404 : ${req.method} ${req.url}`);
      res.status(404).json({
        message:
          "Le produit correspondant à cet ID n'existe pas dans productData.json",
      });
      return;
    }

    // Vérifiez si la catégorie existe
    if (!productJson.category) {
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      console.log("CONTROLLER : Le produit n'a pas de catégorie définie.");
      res.status(400).json({ message: "Le produit doit avoir une catégorie." });
      return; // Ajoutez un retour
    }

    const titleRegex = /^.{3,50}$/;
    const priceRegex = /^[0-9]+(?:\.[0-9]+)?$/;
    const inStockRegex = /^(0|[1-9][0-9]*)$/;

    // Créer une nouvelle instance de ProductsModel avec les données fournies
    const newProduct = new ProductsModel(
      idBody,
      title,
      price,
      description,
      productJson.category,
      inStock
    );

    if (
      !idBody ||
      !title ||
      !price ||
      !description ||
      !inStock ||
      !titleRegex.test(title) ||
      !priceRegex.test(price) ||
      !inStockRegex.test(inStock)
    ) {
      console.log(
        "PRODUCTS CONTROLLER PUT: 400 Veuillez renseigner tous les champs tels que demandés"
      );
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      res.status(400).json({
        message: "Veuillez renseigner tous les champs tels que demandés",
      });
      return;
    } else {
      // Appel à ProductsService pour mettre à jour le fichier productsData.json
      await ProductsService.updateProduct(idBody, newProduct);
      console.log(
        "PRODUCTS CONTROLLER : 200 Le produit a été modifié dans le fichier productsData.json"
      );
      logger.info(`STATUS 400 : ${req.method} ${req.url}`);
      res.status(200).json({
        message: "Le produit a été modifié dans le fichier productsData.json",
      });
    }
  };

  //*********************DELETE PRODUCT BY ID*******************//
  public deleteProduct = async (req: Request, res: Response): Promise<void> => {
   
    const idBody = parseInt(req.params.id);

    if (isNaN(idBody) || !idBody) {
      console.log("CONTROLLER : L ID entré doit etre un entier");
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      res.status(400).json({
        message: "Veuillez renseigner tous les champs de tel que demandé",
      });
      return;
    }
    const productJson = await ProductsService.findById(idBody);

    if (!productJson) {
      console.log(
        "CONTROLLER POST : L ID que vous avez entré nexiste pas dasn le fichier productsData.json"
      );
      logger.error(`STATUS 404 : ${req.method} ${req.url}`);
      res.status(404).json({
        message:
          "Le produit correspondant a cet ID nexiste pas dans productData.json",
      });
      return;
    } else {
      //Appel a ProductsService pour delete le fichier productsData.json avec le nouveau produit
      await ProductsService.deleteProductById(idBody, productJson);
      console.log(
        "PRODUCTS CONTROLLER : 204 Le produit a été retiré du fichier productsData.json"
      );
      logger.info(`STATUS 400 : ${req.method} ${req.url}`);
      res.status(204).json({
        message: "Le produit a été retiré du fichier productsData.json",
      });
      return;
    }
  };
}
