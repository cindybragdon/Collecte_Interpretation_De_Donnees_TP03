import { Users } from "../interfaces/users.interface";

export class UsersModel implements Users {
    constructor(
        public address: {
            geolocation: {
              lat: number,
              long: number
            },
            city: string,
            street: string,
            number: number,
            zipcode: string
        },
        public id: number,
        public email: string,
        public username: string,
        public password: string,
        public name: {
        firstname: string,
        lastname: string
        },
        public phone: string,
        public __v: number
    ) {}
}