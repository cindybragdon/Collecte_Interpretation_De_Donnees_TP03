import { Users } from "../interfaces/users.interface";

export class UsersModel implements Users {
  constructor(
    public address: {
      geolocation: {
        lat: string;
        long: string;
      };
      city: string;
      street: string;
      number: number;
      zipcode: string;
    },
    public id: number,
    public email: string,
    public role: "gestionnaire" | "employe",
    public username: string,
    public password: string,
    public name: {
      firstname: string;
      lastname: string;
    },
    public phone: string,
    public __v: number
  ) {
    this.address = address;
    this.id = id;
    this.email = email;
    this.role = role;
    this.username = username;
    this.password = password;
    this.name = name;
    this.phone = phone;
    this.__v = __v;
  }
}
