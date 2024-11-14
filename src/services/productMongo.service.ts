import ProductModeleSchema from "../models/productMongo.model";

const titleRegex = /^.{3,50}$/;
const priceRegex = /^(0|[1-9][0-9]*)$/;
const quantityRegex = /^(0|[1-9][0-9]*)$/;

export class ProductMongoService {
    public static async getAllProducts(
        minPrice: number = 0,
        maxPrice: number = 999999999999,
        minStock: number = 0,
        maxStock: number = 999999999999
    ) {
        return await ProductModeleSchema.find({
            price: { $gte: minPrice, $lte: maxPrice },
            quantity: { $gte: minStock, $lte: maxStock }
        });
    }

    public static async createProduct(data: any) {
        const { title, price, quantity, description, category, image, rating } = data;

        if (!title || !titleRegex.test(title)) {
            throw new Error('Le champ "title" doit être renseigné et contenir entre 3 et 50 caractères.');
        }

        if (price === undefined || !priceRegex.test(price)) {
            throw new Error('Le champ "price" doit être un entier positif.');
        }

        if (quantity !== undefined && !quantityRegex.test(quantity)) {
            throw new Error('Le champ "quantity" doit être un entier positif.');
        }

        const productToAdd = new ProductModeleSchema({
            title, price, description, category, image, rating, quantity
        });

        return await productToAdd.save();
    }

    public static async updateProduct(id: string, data: any) {
        const { title, price, quantity } = data;

        if (title && !titleRegex.test(title)) {
            throw new Error('Le champ "title" doit contenir entre 3 et 50 caractères.');
        }

        if (price !== undefined && !priceRegex.test(price)) {
            throw new Error('Le champ "price" doit être un entier positif.');
        }

        if (quantity !== undefined && !quantityRegex.test(quantity)) {
            throw new Error('Le champ "quantity" doit être un entier positif.');
        }

        return await ProductModeleSchema.findByIdAndUpdate(id, data, { new: true });
    }

    public static async getProductById(id: string) {
        return await ProductModeleSchema.findById(id);
    }

    public static async deleteProduct(id: string) {
        const product = await ProductModeleSchema.findById(id);
        if (!product) throw new Error("Produit non trouvé");
        await ProductModeleSchema.deleteOne({ _id: id });
        return id;
    }
}
