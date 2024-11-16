import fetch from "node-fetch";
import ProductSchema from "./models/productMongo.model";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface ProductMongoDocument { 
  id: number;
  title: string; 
  description: string;
  category: string;
  price: number;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const fetchPRODUCTSApiStoredInMongoDB = async () => {
  try {
    console.log("Fetch Mongo : Démarrage du fetch des produits depuis l'API Fake Store.");

    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error(`Fetch Mongo : Erreur lors de la récupération de l'API Fake Store (${response.status})`);
    }

    const products: Product[] = await response.json();

    console.log("Fetch Mongo : Voici les Produits récupérés depuis l'API Fake Store avant validation : ", products);

     // Validation des produits
     const validProducts: ProductMongoDocument[] = products
     .map((product) => {
       // Validation sur le champ title et price.  Les autres données sont facultatives, mais ces champs aident à find() et sont essentiels.

       if (!(product.title.length >= 3 && product.title.length <= 50)) {
         console.error('Fetch Mongo : Produit non valide:', product);
         return null;
       }

       if (!product.title || !product.price) {
         console.error('Fetch Mongo : Produit incomplet:', product);
         return null;
       }

       // Format modèle MongoDB
       return {
         id: product.id,
         title: product.title, 
         description: product.description,
         category: product.category,
         price: product.price,
         image: product.image,
         rating: product.rating,
       };
     })
     .filter(Boolean) as ProductMongoDocument[]; // Garder les produits valides


    console.log(`Fetch Mongo : ${validProducts.length} produits valides trouvés.`);

    if (validProducts.length > 0) {
      await ProductSchema.deleteMany({}); // Vider la collection MongoDB
      console.log("Fetch Mongo : Collection MongoDB vidée.");
      await ProductSchema.insertMany(validProducts) // Utiliser les produits validés
        .then((result) => {
          console.log("Produits insérés avec succès :", result);
        })
        .catch((err) => {
          console.error("Erreur d'insertion dans MongoDB :", err);
        });
    }
  } catch (error) {
    console.error("Fetch Mongo : Erreur générale :", error);
  }
};

export default fetchPRODUCTSApiStoredInMongoDB;