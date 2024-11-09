"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productsMongo_controller_1 = require("../controllers/productsMongo.controller");
const router = (0, express_1.Router)();
const productMongoController = new productsMongo_controller_1.ProductsMongoController();
// Version 2 de l'API
router.get('/v2/products', productMongoController.getAllProductsMongo);
exports.default = router;
