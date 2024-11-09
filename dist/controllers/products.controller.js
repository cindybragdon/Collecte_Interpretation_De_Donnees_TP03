"use strict";
// Le CONTROLLER est le point d'entrée des requêtes HTTP. Il reçoit
// les requêtes, vérifie les paramètres d'entrée (ex. l'ID du produit),
//  et utilise le service pour effectuer des opérations.
// Le contrôleur ne devrait pas contenir de logique métier complexe.
// Il devrait principalement déléguer les tâches au service.
// Par exemple, dans ton ProductsController, tu aurais une fonction
// qui récupère l'ID d'une requête, appelle la méthode findById
// du service, puis renvoie la réponse au client.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const products_service_1 = require("../services/products.service");
const products_model_1 = require("../models/products.model");
const fs = __importStar(require("fs"));
const winston_logger_1 = require("../logger/winston.logger");
class ProductsController {
    constructor() {
        //*********************GET ALL PRODUCTS*******************//
        //Methode async qui prend req et res et qui ne retourne rien. getAllProducts fait des appels async
        this.getAllProducts = async (req, res
        //Promesse de traitement en attente
        ) => {
            console.log("on est dans products.controller" + req.params);
            try {
                //Extraction des parametres qui sont stockés dans req.params
                const { minPrice, maxPrice, minInStock, maxInStock } = req.query;
                //les param sont parsé dans le format nécessaire. Si non présent, ils sont undefined pour éviter les exceptions
                const minimumPriceValue = minPrice
                    ? parseFloat(minPrice)
                    : undefined;
                const maximumPriceValue = maxPrice
                    ? parseFloat(maxPrice)
                    : undefined;
                const minimumInStockValue = minInStock
                    ? parseInt(minInStock)
                    : undefined;
                const maximumInStockValue = maxInStock
                    ? parseInt(maxInStock)
                    : undefined;
                //Attend le retour de l'api et des manip faites sur le data
                //Envoie à getProductsFiltered() les param pris de API URL et convertis filtrés
                //*********************GET PRODUCTS FILTERED*******************//
                const product = await products_service_1.ProductsService.getProductsFiltered(minimumPriceValue, maximumPriceValue, minimumInStockValue, maximumInStockValue);
                winston_logger_1.logger.info(`${req.method} ${req.url}`);
                res.status(200).json({
                    message: "On est cool, ça passe! Les products sont filtrés ",
                    product,
                });
                //tests console
                console.log("REFRESH BROWSER On est dans ProductsController");
            }
            catch (error) {
                console.log(error);
                winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                res
                    .status(400)
                    .json({ message: "Erreur lors du get des products filtrés" });
            }
        };
        //*********************POST NEW PRODUCT*******************//
        this.postNewProduct = async (req, res) => {
            //Cueillette des éléments dans le body (Postman) (req.body)
            const { title, price, description, category, inStock } = req.body;
            const productsList = Array.from(JSON.parse(fs.readFileSync("./data/productData.json", {
                encoding: "utf8",
                flag: "r",
            })));
            let id = productsList.length + 1;
            const titleRegex = /^.{3,50}$/;
            const priceRegex = /^[0-9]+(?:\.[0-9]+)?$/;
            const inStockRegex = /^(0|[1-9][0-9]*)$/;
            console.log("id" +
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
                inStock);
            // Créer une nouvelle instance de ProductsModel avec les données fournies
            const newProduct = new products_model_1.ProductsModel(id, title, price, description, category, inStock);
            //401 Si le user n'est pas autorisé
            // if (AUCUNE IDÉE) {
            //   console.log('PRODUCTS CONTROLLER : 401 Vous nêtes pas autorisé à ajouter un produit')
            //   res.status(401).json({ message: "Vous n'êtes pas autorisé à ajouter un produit" });
            // }
            //400 Si il manque une donnée dans le request body
            if (!id ||
                !title ||
                !price ||
                !description ||
                !category ||
                !inStock ||
                !titleRegex.test(title) ||
                !priceRegex.test(price) ||
                !inStockRegex.test(inStock)) {
                console.log("PRODUCTS CONTROLLER : 400 Veuillez renseigner tous les champs de tel que demandé");
                winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                res.status(400).json({
                    message: "Veuillez renseigner tous les champs de tel que demandé",
                });
            }
            else {
                //Appel a ProductsService pour append le fichier productsData.json avec le nouveau produit
                await products_service_1.ProductsService.addNewProduct(newProduct);
                console.log("PRODUCTS CONTROLLER : 200 Le nouveau produit a été ajouté au fichier productsData.json");
                winston_logger_1.logger.info(`STATUS 200: ${req.method} ${req.url}`);
                res.status(200).json({
                    message: "Le nouveau produit a été ajouté au fichier productsData.json",
                });
            }
        };
        //*********************GET/PUT PRODUCT BY ID*******************//
        this.putProduct = async (req, res) => {
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
                winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                res.status(400).json({
                    message: "Veuillez renseigner tous les champs tels que demandés",
                });
                return;
            }
            // Recherche du produit dans le JSON
            const productJson = await products_service_1.ProductsService.findById(idBody);
            if (!productJson) {
                console.log("CONTROLLER POST : L ID que vous avez entré n existe pas dans le fichier productsData.json");
                winston_logger_1.logger.error(`STATUS 404 : ${req.method} ${req.url}`);
                res.status(404).json({
                    message: "Le produit correspondant à cet ID n'existe pas dans productData.json",
                });
                return;
            }
            // Vérifiez si la catégorie existe
            if (!productJson.category) {
                winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("CONTROLLER : Le produit n'a pas de catégorie définie.");
                res.status(400).json({ message: "Le produit doit avoir une catégorie." });
                return; // Ajoutez un retour
            }
            const titleRegex = /^.{3,50}$/;
            const priceRegex = /^[0-9]+(?:\.[0-9]+)?$/;
            const inStockRegex = /^(0|[1-9][0-9]*)$/;
            // Créer une nouvelle instance de ProductsModel avec les données fournies
            const newProduct = new products_model_1.ProductsModel(idBody, title, price, description, productJson.category, inStock);
            if (!idBody ||
                !title ||
                !price ||
                !description ||
                !inStock ||
                !titleRegex.test(title) ||
                !priceRegex.test(price) ||
                !inStockRegex.test(inStock)) {
                console.log("PRODUCTS CONTROLLER PUT: 400 Veuillez renseigner tous les champs tels que demandés");
                winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                res.status(400).json({
                    message: "Veuillez renseigner tous les champs tels que demandés",
                });
                return;
            }
            else {
                // Appel à ProductsService pour mettre à jour le fichier productsData.json
                await products_service_1.ProductsService.updateProduct(idBody, newProduct);
                console.log("PRODUCTS CONTROLLER : 200 Le produit a été modifié dans le fichier productsData.json");
                winston_logger_1.logger.info(`STATUS 400 : ${req.method} ${req.url}`);
                res.status(200).json({
                    message: "Le produit a été modifié dans le fichier productsData.json",
                });
            }
        };
        //*********************DELETE PRODUCT BY ID*******************//
        this.deleteProduct = async (req, res) => {
            //Ici on vérifie si on peut convertir le id en int.
            //Si il s'agit de chiffre, tout sera cool.  Sinon, ça retourne isNaN
            const idBody = parseInt(req.params.id);
            //401 Si le user n'est pas autorisé
            // if (AUCUNE IDÉE) {
            //   console.log('PRODUCTS CONTROLLER : 401 Vous nêtes pas autorisé à ajouter un produit')
            //   res.status(401).json({ message: "Vous n'êtes pas autorisé à ajouter un produit" });
            // }
            if (isNaN(idBody) || !idBody) {
                console.log("CONTROLLER : L ID entré doit etre un entier");
                winston_logger_1.logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                res.status(400).json({
                    message: "Veuillez renseigner tous les champs de tel que demandé",
                });
                return;
            }
            // Recherche du produit dans le JSON
            const productJson = await products_service_1.ProductsService.findById(idBody);
            if (!productJson) {
                console.log("CONTROLLER POST : L ID que vous avez entré nexiste pas dasn le fichier productsData.json");
                winston_logger_1.logger.error(`STATUS 404 : ${req.method} ${req.url}`);
                res.status(404).json({
                    message: "Le produit correspondant a cet ID nexiste pas dans productData.json",
                });
                return;
            }
            else {
                //Appel a ProductsService pour delete le fichier productsData.json avec le nouveau produit
                await products_service_1.ProductsService.deleteProductById(idBody, productJson);
                console.log("PRODUCTS CONTROLLER : 204 Le produit a été retiré du fichier productsData.json");
                winston_logger_1.logger.info(`STATUS 400 : ${req.method} ${req.url}`);
                res.status(204).json({
                    message: "Le produit a été retiré du fichier productsData.json",
                });
                return;
            }
        };
    }
}
exports.ProductsController = ProductsController;
