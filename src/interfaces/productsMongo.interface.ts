import { Document } from 'mongoose';

export interface IProductMongo extends Document {
  id: number;              
  title: string;
  description: string;
  category: string;
  quantity?: number;       
  price: number;
  image: string;           
  rating: {                
    rate: number;
    count: number;
  };
}
