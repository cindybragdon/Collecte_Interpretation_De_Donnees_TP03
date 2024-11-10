import ProductModeleSchema from "../models/productMongo.model";

    const titleRegex = /^.{3,50}$/;
	const priceRegex = /^(0|[1-9][0-9]*)$/;
	const quantityRegex = /^(0|[1-9][0-9]*)$/;

export class ProductMongoService {
    
    // Méthode pour récupérer tous les produits
    public static async getAllProducts() {
        try {
            return await ProductModeleSchema.find();
        } catch (error) {
            throw new Error("ProductMongo.Service : Erreur lors de la récupération des produits");
        }
    }

    // Méthode pour créer un nouveau produit
    public static async createProduct(data: any) {
        const { title, price, quantity } = data;

        // Validation des champs
        if (!title || !titleRegex.test(title)) {
            throw new Error('ProductMongo.Service : Le champ "title" doit être renseigné et contenir entre 3 et 50 caractères.');
        }

        if (!price || !priceRegex.test(price)) {
            throw new Error('ProductMongo.Service : Le champ "price" doit être renseigné et être un entier positif.');
        }

        if (quantity && !quantityRegex.test(quantity)) {
            throw new Error('ProductMongo.Service : Le champ "quantity" doit être un entier positif.');
        }

        const { description, category, image, rating } = data;
        
        const productToAdd = new ProductModeleSchema({
            title, price, description, category, image, rating, quantity
        });

        try {
            return await productToAdd.save();
        } catch (error) {
            throw new Error("ProductMongo.Service : Erreur lors de l'ajout du produit");
        }
    }

    // Méthode pour mettre à jour un produit existant
    public static async updateProduct(id: string, data: any) {
        const { title, price, quantity } = data;

        // Validation des champs
        if (title && !titleRegex.test(title)) {
            throw new Error('ProductMongo.Service : Le champ "title" doit être contenu entre 3 et 50 caractères.');
        }

        if (price && !priceRegex.test(price)) {
            throw new Error('ProductMongo.Service : Le champ "price" doit être un entier positif.');
        }

        if (quantity && !quantityRegex.test(quantity)) {
            throw new Error('ProductMongo.Service : Le champ "quantity" doit être un entier positif.');
        }

        try {
            const product = await ProductModeleSchema.findById(id);
            if (!product) throw new Error("ProductMongo.Service : Produit non trouvé");

            // Mettre à jour les champs
            Object.assign(product, data);
            return await product.save();
        } catch (error) {
            throw new Error("ProductMongo.Service : Erreur lors de la mise à jour du produit");
        }
    }

    // Méthode pour supprimer un produit
    public static async deleteProduct(id: string) {
        try {
            const product = await ProductModeleSchema.findById(id);
            if (!product) throw new Error("ProductMongo.Service : Produit non trouvé");

            await ProductModeleSchema.deleteOne({ _id: id });
            return id;
        } catch (error) {
            throw new Error("ProductMongo.Service : Erreur lors de la suppression du produit");
        }
    }
}
