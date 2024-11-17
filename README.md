# Travail Pratique 03: Développement d'une API RESTful pour la gestion d'inventaire avec MongoDB
## Dans le cadre du cours Collecte et Interpretation de données 420-514-MV
## Enseigné par Sara Boumehraz, Cégep Marie-Victorin

## Rapport d'analyse fonctionnelle et technique ainsi que de conformité aux exigences <br>

Dans le cadre du développement d'une API RESTful pour la gestion d'inventaire d'une entreprise, ce projet vise à approfondir les compétences en persistance des données, en sécurité des API et en automatisation des tests. Ce travail s’inscrit dans la continuité du TP1, où une API fonctionnelle a été développée avec Node.js, Express et TypeScript pour gérer les opérations CRUD sur des produits et utilisateurs.<br>

Dans ce TP3, l’objectif principal est d’intégrer une base de données MongoDB afin de remplacer le stockage local JSON, de mettre en place un serveur de test sécurisé, et de garantir la fiabilité de l’API grâce à des tests automatisés couvrant à la fois les aspects fonctionnels et sécuritaires. En outre, des tests de performance seront réalisés pour vérifier la stabilité de l'API sous charge.  Les deux versions de l’API doivent être indépendantes l’une de l’autre et être accessibles simultanément.<br>

Ce rapport détaille les mesures et configurations mises en place pour satisfaire les exigences fonctionnelles et techniques, en s’assurant de respecter les bonnes pratiques de développement et de sécurité. Il présente également les outils et méthodologies utilisés pour l’automatisation des tests et la gestion des environnements de test et de production.<br>

---

## Conformité aux exigences fonctionnelles<br>

Après réflexion, j'ai décidé de concevoir la version 2 de l'API (intégrant MongoDB) dans des fichiers séparés de ceux utilisés pour la version 1 (basée sur JSON). Cependant, je m'interroge sur l'opportunité d'une autre approche : celle de faire cohabiter les deux versions au sein d'une même base de code, ce qui aurait peut-être été plus organisé.<br>

Lorsque je suis passée à l'écriture des tests, j'ai réalisé que cette séparation m'obligeait à rédiger deux fois plus de tests, ce qui a considérablement alourdi le travail. Certes, la structure choisie présente l’avantage de faciliter la localisation des fichiers spécifiques à MongoDB, mais elle contribue également à rendre le projet plus complexe et potentiellement moins fluide à maintenir à long terme.<br>

## Persistance des données avec MongoDB et JSON<br>
Mise en place de MongoDB avec AtlasDB et la connexion via les variables d’environnement.  Les connexions préalablement faites pour le TP1 sont toujours accessibles.<br>

![image](https://github.com/user-attachments/assets/3635cacd-2317-4b65-ab77-911b7f225f5e)


 ---

## Documentation des Accommodements entre ProductsController et ProductsMongoController<br>

Le projet utilise deux implémentations distinctes pour la gestion des produits :<br>
o	JSON (ProductsController & UsersController)  : basé sur des fichiers JSON pour le stockage des données.  Solution rapide et simple à mettre en œuvre pour prototyper.  Pas de dépendance externe à une base de données.  Données faciles à manipuler directement dans un fichier.<br>

o	MongoDB (ProductsMongoController & UsersMongoController) :basé sur MongoDB pour un stockage persistant et scalable. Conçu pour des volumes de données plus importants et des scénarios multi-utilisateurs. Gestion des requêtes plus performante grâce à un moteur de base de données optimisé.  Scalabilité accrue et intégration facile avec d'autres services.
N’empêche, les controller se ressemblent d’une version à l’autre : <br>

![image](https://github.com/user-attachments/assets/5ed3b306-276e-40c2-8ec4-312b449378e1)

 
Les services diffèrent légèrement cependant :<br> 

o	JSON (ProductsService & UsersService)  : Solution simple pour tester rapidement les fonctionnalités liées aux utilisateurs.  : Les données peuvent être manipulées directement via le fichier JSON sans appel extérieur.<br>

o	MongoDB (ProductsMongoService & UsersMongoService) : Conçu pour une gestion robuste, sécurisée et évolutive des utilisateurs.<br>

![image](https://github.com/user-attachments/assets/8f9a5cbf-d55e-4482-ad38-f1f899364df5)

---

## Accommodements techniques<br>

## Structure de données<br>
o	JSON : Dans UsersService, les données des utilisateurs sont converties en instances de UsersModel, ajoutant une couche de structuration. Cependant, chaque opération nécessite une manipulation locale du fichier JSON.<br>
o	MongoDB : Les données des utilisateurs sont directement gérées en tant que documents MongoDB, ce qui simplifie les opérations complexes et permet d'exploiter des fonctionnalités comme les index.<br>

## Mot de passe : génération vs sécurisation<br>
o	JSON : Les mots de passe sont créés dynamiquement à l'aide de generate-password, mais ils ne sont pas protégés (absence de hachage).<br>
o	MongoDB : Les mots de passe sont toujours hachés avec bcrypt, offrant un niveau de sécurité beaucoup plus élevé.<br>

## Recherche par email<br>
o	JSON : La méthode findUserEmail parcourt l'intégralité du fichier JSON en mémoire, utilisant une recherche linéaire inefficace pour de grandes quantités de données.<br>

o	MongoDB : MongoDB permet une recherche rapide grâce à l'utilisation d'index optimisés pour les champs, comme l'email.<br>

## Authentification et gestion des sessions<br>
o	JSON : Aucune gestion des sessions ou des authentifications n'est implémentée dans UsersService.<br>
o	MongoDB : Avec UsersMongoService, les sessions sont sécurisées via des tokens JWT, configurables avec une date d'expiration.<br>

## Tests<br>
Je n’ai pas su faire les tests nécessaires à la protection et au contrôle de qualité complet de l’API.  Cependant, j’ai bien compris que vous avions 3 types de tests à faire sur chacun des endpoint et des responses.<br>

---
---
---

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
