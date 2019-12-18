const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const productsController = require('../controllers/products');

const router = express.Router();



//   /admin/add-product =>GET
router.get('/add-product',productsController.getAddProduct);


//   /admin/add-product =>POST
router.post('/add-product',productsController.postAddProduct);


// exports.routes = router;
// exports.products = products;

module.exports = router;