import mongoose, { Schema, Document } from 'mongoose';
import { ProductMongo } from '../interfaces/productsMongo.interface';

const productModeleSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxLength: 50,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    quantity: {
        type: Number,
        min : 0,
    },
    price: {
        type: Number,
        min: 0
    }
});

export const ProductModeleSchema = mongoose.model<ProductMongo>('Product', productModeleSchema);

