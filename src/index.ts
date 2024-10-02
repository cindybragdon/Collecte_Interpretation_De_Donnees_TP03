import express, { Request, Response } from 'express';
import userRoutes from './routes/users.route';
import {UserService} from './services/users.service'
import { ProductsService } from './services/products.service';

const app = express();
const port = 3000;

// Middleware de parsing du JSON
app.use(express.json());

// Route de base
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.use('/', userRoutes);

// Démarrage du serveur
app.listen(port, () => {
  
  console.log(`Serveur en écoute sur <http://localhost>:${port}`);
  UserService.getAllUsers();
  ProductsService.getAllProducts();
  console.log('On est dans index');
});