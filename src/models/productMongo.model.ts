import mongoose, { Schema } from 'mongoose';
import { IProductMongo } from '../interfaces/productsMongo.interface';

const ProductSchema = new Schema<IProductMongo>({
  id: { type: Number, required: true, unique: true },  
  title: { 
    type: String, 
    required: true, 
    minlength: 3, 
    maxlength: 50 
  },
  description: { 
    type: String, 
  },
  category: { 
    type: String, 
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
  },
  rating: {
    rate: { 
      type: Number, 
    },
    count: { 
      type: Number, 
    },
  },
});


export default mongoose.model<IProductMongo>('Product', ProductSchema);


