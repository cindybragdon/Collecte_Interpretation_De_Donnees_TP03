import { Products } from "../interfaces/products.interface";
import { ProductsModel } from "../models/products.model";
import * as fs from "fs";
import * as path from "path";

//import { key } from '../services/auth.service';

export class ProductsService {

  //findById prend allProducts et retourne seulement ceux avec le id correspondant
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

    // Fetch API qui renvoie les utilisateurs au format JSON
    const productsFromApi = await fetch(
      "https://fakestoreapi.com/products"
    ).then((response) => response.json());

    // Map des données récupérées depuis l'API à des instances de UsersModel
    //On crée des instances de Products en prenant les Products de API et en ajoutant un attibut
    const products = productsFromApi.map((product: Products) => {
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

    //Populer le JSON avec productsData
    const productsData = JSON.stringify(products, null, 2);
    const dir = path.join(__dirname, "../../data");
    const filePath = path.join(dir, "productsData.json");
    //Si le répertoire n'existe pas, crée le
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    try {
      fs.writeFileSync(filePath, productsData);
      console.log(
        "SERVICE : Le fichier productsData.json est populé par API FakeStore/products"
      );
    } catch (err) {
      console.error(
        "SERVICE : Erreur lors de lécriture de productsData dans productsData.json"
      );
    }

    return products;
  }

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
        (minPrice === undefined || product.price >= minPrice) &&
        (maxPrice === undefined || product.price <= maxPrice) &&
        (minInStock === undefined || product.inStock >= minInStock) &&
        (maxInStock === undefined || product.inStock <= maxInStock)
      );
    });
  }
}
