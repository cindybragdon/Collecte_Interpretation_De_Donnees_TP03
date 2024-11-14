// src/models/User.model.ts
import mongoose, { Schema } from 'mongoose';
import { IUserMongo } from '../interfaces/usersMongo.interface';

const UserSchema = new Schema<IUserMongo>({
  id: { type: Number, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email: string) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
      },
      message: (props: any) => `${props.value} format d'email invalide.`,
    },
  },
  role: { type: String, enum: ['gestionnaire', 'employe'], required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
  },
  phone: { type: String, required: true }
});

export default mongoose.model<IUserMongo>('User', UserSchema);
