import * as fs from "fs";
import * as path from "path";

export async function fetchFromAPi() {

    // Fetch API qui renvoie les utilisateurs au format JSON
    const productsFromApi = await fetch(
        "https://fakestoreapi.com/products"
        ).then((response) => response.json());


    //Populer le JSON avec productsData
    //const productsData = JSON.stringify(products, null, 2);
    const productsData = JSON.stringify(productsFromApi, null, 2);
    const filePath = path.join(__dirname, "../../data/productsData.json");
    //Si le répertoire n'existe pas, crée le
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    try {

      fs.writeFileSync(filePath, productsData);
      console.log(
        "SERVICE : Le fichier productsData.json est populé par API FakeStore/products"
      );
    } catch (err) {
      console.error(
        "SERVICE : Erreur lors de lécriture de productsData dans productsData.json"
      );
    }

  

}
