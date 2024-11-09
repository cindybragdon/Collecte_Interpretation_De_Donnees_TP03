"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProductsFromAPi = fetchProductsFromAPi;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function fetchProductsFromAPi() {
    // Fetch API qui renvoie les utilisateurs au format JSON
    const productsFromApi = await fetch("https://fakestoreapi.com/products").then((response) => response.json());
    //Populer le JSON avec productsData
    //const productsData = JSON.stringify(products, null, 2);
    const productsData = JSON.stringify(productsFromApi, null, 2);
    const filePath = path.join(__dirname, "data/productsData.json");
    //Si le répertoire n'existe pas, crée le
    //if (!fs.existsSync(filePath)) {
    //  fs.mkdirSync(filePath, { recursive: true });
    //}
    try {
        fs.writeFileSync('data/productData.json', productsData);
        console.log("FETCH PRODUITS : Le fichier productsData.json est populé par API FakeStore/products");
    }
    catch (err) {
        console.error("FETCH PRODUITS : Erreur lors de lécriture de productsData dans productsData.json");
    }
}
