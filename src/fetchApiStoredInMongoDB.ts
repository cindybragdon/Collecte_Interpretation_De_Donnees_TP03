import fetch from 'node-fetch';
import ProductMongo from './models/productMongo.model';

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

// Fetch des produits sur l'API
const fetchApiStoredInMongoDB = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products: Product[] = await response.json();

    console.log('Fetch Mongo : Produits récupérés depuis l\'API Fake Store :', products);

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

    // Push les produits valides dans MongoDB
    if (validProducts.length > 0) {
      await insertProductsToMongoDB(validProducts);
    } else {
      console.log('Fetch Mongo : Aucun produit valide à insérer.');
    }
  } catch (error) {
    console.error('Fetch Mongo : Erreur lors de la récupération des produits :', error);
  }
};

// Fonction push des produits dans MongoDB
const insertProductsToMongoDB = async (products: ProductMongoDocument[]) => {
  try {
     // Delete Many vide la collection pour éviter les doublons
     await ProductMongo.deleteMany({});
    // Insert all products dans MongoDB
    await ProductMongo.insertMany(products);  // Utilisez votre modèle MongoDB pour l'insertion
    console.log('Fetch Mongo : MongoDB populé avec succès!');
  } catch (error) {
    console.error('Fetch Mongo : Erreur lors de la population des produits dans MongoDB :', error);
  }
};

export default fetchApiStoredInMongoDB;
