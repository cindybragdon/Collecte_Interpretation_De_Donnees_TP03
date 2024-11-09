import mongoose, { Schema, Document } from 'mongoose';


export interface ProductMongo extends Document {
    name: string;
    description: string;
    category: string;
    quantity: number;
    price: number;
}