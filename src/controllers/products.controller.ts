import { Request, Response } from "express";
import { ProductsService } from "../services/products.service";

export class ProductsController {
  private productsService = new ProductsService();

  //Methode async qui prend req et res et qui ne retourne rien. getAllProducts fait des appels async
  public getAllProducts = async (
    req: Request,
    res: Response
    //Promesse de traitement en attente
  ): Promise<void> => {
    console.log("on est dans products.controller" + req.params);

    try {
      //Extraction des parametres qui sont stockés dans req.params
      const { minPrice, maxPrice, minInStock, maxInStock } = req.params;

      //les param sont parsé dans le format nécessaire. Si non présent, ils sont undefined pour éviter les exceptions
      const minimumPriceValue = minPrice ? parseFloat(minPrice) : undefined;
      const maximumPriceValue = maxPrice ? parseFloat(maxPrice) : undefined;
      const minimumInStockValue = minInStock ? parseInt(minInStock) : undefined;
      const maximumInStockValue = maxInStock ? parseInt(maxInStock) : undefined;

      //Attend le retour de l'api et des manip faites sur le data
      //Envoie à getProductsFiltered() les param pris de API URL et convertis filtrés
      const product = await ProductsService.getProductsFiltered(
        minimumPriceValue,
        maximumPriceValue,
        minimumInStockValue,
        maximumInStockValue
      );

      res.status(200).json({message: "On est cool, ça passe! Les products sont filtrés ",product,});

      //tests console
      console.log(req.params.minPrice);
      console.log("REFRESH BROWSER On est dans ProductsController");


      //Attend le retour de l'api et des manip faites sur le data
      //Produits non filtrés
      const products = await ProductsService.getAllProducts(
        parseInt(req.params.minPrice),
        parseInt(req.params.maxPrice),
        parseInt(req.params.minInStock),
        parseInt(req.params.maxInStock)
      );

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors du get des products filtrés" });
    }
  };
}
