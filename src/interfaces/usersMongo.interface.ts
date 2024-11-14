import { Document } from 'mongoose';

export interface IUserMongo extends Document {
  id: number;
  email: string;
  role: 'gestionnaire' | 'employe';
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
}