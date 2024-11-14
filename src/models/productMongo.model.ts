import mongoose, { Schema } from 'mongoose';
import { IProductMongo } from '../interfaces/productsMongo.interface';

const ProductSchema = new Schema<IProductMongo>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, minlength: 3, maxlength: 50 },
  description: { type: String },
  category: { type: String },
  quantity: { 
    type: Number, 
    default: 0,
    validate: {
      validator: (value: number) => Number.isInteger(value) && value >= 0,
      message: 'La quantité doit être un entier positif ou zéro.'
    }
  },
  price: { 
    type: Number, 
    required: true, 
    validate: {
      validator: (value: number) => Number.isInteger(value) && value >= 0,
      message: 'Le prix doit être un entier positif ou zéro.'
    }
  },
  image: { type: String },
  rating: {
    rate: { type: Number },
    count: { type: Number },
  },
});

export default mongoose.model<IProductMongo>('Product', ProductSchema);
