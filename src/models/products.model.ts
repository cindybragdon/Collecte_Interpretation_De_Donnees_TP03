import {Products} from '../interfaces/products.interface'


export class ProductsModel implements Products{
    constructor(
        public id: number,
        public title: string,
        public price: number,
        public description: string,
        public category: string,
        public inStock: number
    ) {
        
    }
}
