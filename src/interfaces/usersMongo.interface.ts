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
