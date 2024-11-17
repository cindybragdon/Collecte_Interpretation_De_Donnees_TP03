import { Document } from 'mongoose';
/*
export interface IUserMongo extends Document {
  _id: string;
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
*/
export interface IUserMongo {
  //_id: string;
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
