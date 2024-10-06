import express, { Request, Response } from 'express';
import userRoutes from './routes/users.route';
import productRoutes from './routes/products.route';
import {UsersService} from './services/users.service'
import { ProductsService } from './services/products.service';
import { fetchProductsFromAPi } from './fetchProductsApi';
import { fetchUsersFromAPi } from './fetchUsersApi';

const app = express();
const port = 3000;

// Middleware de parsing du JSON
app.use(express.json());

// Route de base
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.use('/', userRoutes);
app.use('/', productRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur <http://localhost>:${port}`);
  console.log('DÉMARRAGE SERVEUR On est dans index');
  fetchProductsFromAPi()
  fetchUsersFromAPi()
  UsersService.getAllUsers();
  ProductsService.getAllProducts();
});