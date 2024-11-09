<a name="top"></a>

# Travail Pratique 03: Développement d'une API RESTful pour la gestion d'inventaire
## Dans le cadre du cours Collecte et Interpretation de données 420-514-MV
## Enseigné par Sara Boumehraz, Cégep Marie-Victorin

## :notebook: Table des matières
 
- [Installation de l'application](#installation-de-lapplication)
- [API FakeStore](#api-fakestore)
- [Documentation Swagger](#documentation-swagger)
- [Documentation de tests Postman](#documentation-de-tests-postman)
- [Fichier .env](#fichier-env)

---

## Installation de l'application
:wrench: 
_Lancer le script script_install_all afin d'installer toutes les librairies nécessaires au bon fonctionnement de l'application._
![image](https://github.com/user-attachments/assets/08113449-b8fb-41ca-8e82-c33d4bf599d3)

---

## API FakeStore
:convenience_store: 
_Intégration de l'API FakeStore.  L'API est disponible à l'url suivant :_ <https://fakestoreapi.com/><br>
_Les users sont disponibles au endpoint :_ <https://fakestoreapi.com/products><br>
_Les produits sont disponibles au endpoint :_ <https://fakestoreapi.com/products>

![image](https://github.com/user-attachments/assets/0fa6816a-ae32-491b-8949-091c86083d73)

_Pour que vos json soit plus agréables, installez l'extention pour Google Chrome JSON Beautifier & Editor_ <https://chromewebstore.google.com/detail/json-beautifier-editor/lpopeocbeepakdnipejhlpcmifheolpl>

![image](https://github.com/user-attachments/assets/9d02f6dc-458d-4a7e-8bb4-56a6c3c2260b)

---

## Documentation Swagger
:alien: 
_Liens et informations sur la documentation générée avec Swagger._

![image](https://github.com/user-attachments/assets/5579ea14-45d0-4fae-8218-ad3f2ccf9d66)

_Démarrer l'application en lançant 'npm run start' dans le terminal.  Dans votre navigateur, aller à :_ <https://localhost:3000/v1/api-docs/>

:arrow_up: [Retour en haut](#top)

---

## Documentation de tests Postman
:mailbox_with_mail: 
_Téléchargez Postman ici :_ <https://www.postman.com/downloads/>

_Importez la collection directement du projet GitHub_

_Les tests API avec Postman._

![image](https://github.com/user-attachments/assets/daf6cfd7-bbf2-446f-bf12-a9b37c7af774)

_Étape 1 : Envoyer des requêtes_
Les API RESTful permettent d'effectuer des opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) en utilisant les méthodes HTTP POST, GET, PUT, et DELETE.
Cette collection contient chacun de ces types de requêtes. Ouvrez chaque requête et cliquez sur "Envoyer" pour voir ce qui se passe.

_Étape 2 : Consulter les réponses_
Observez l'onglet des réponses pour vérifier le code de statut (200 OK), le temps de réponse et la taille de la réponse.

_Étape 3 : Envoyer de nouvelles données dans le "Body"_
Mettez à jour ou ajoutez de nouvelles données dans la section "Body" de la requête POST. En général, les données du "Body" sont également utilisées dans la requête PUT.

---

## Fichier .env
_Fichier .env inclus._

---

:arrow_up: [Retour en haut](#top)
