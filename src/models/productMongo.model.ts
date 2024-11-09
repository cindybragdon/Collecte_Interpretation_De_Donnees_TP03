import mongoose, { Schema } from 'mongoose';
import { IProductMongo } from '../interfaces/productsMongo.interface';

const ProductSchema = new Schema<IProductMongo>({
  id: { type: Number, required: true, unique: true },  
  title: { 
    type: String, 
    required: true, 
    minlength: 3, 
    maxlength: 200 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 0 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  image: { 
    type: String, 
    required: true 
  },
  rating: {
    rate: { 
      type: Number, 
      required: true 
    },
    count: { 
      type: Number, 
      required: true 
    },
  },
});

// Exportation du modèle Mongoose
export default mongoose.model<IProductMongo>('Product', ProductSchema);


