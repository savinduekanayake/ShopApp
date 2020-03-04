const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth  = require('../middleware/is-auth');

//   /admin/add-product =>GET
router.get('/add-product',isAuth,adminController.getAddProduct);

//   /admin/products =>GET
router.get('/products',isAuth,adminController.getProducts);

//   /admin/add-product =>POST
router.post('/add-product',isAuth,adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);

//  /admin/edit-product =>POST
router.post('/edit-product',isAuth,adminController.postEditProduct);

// //delete a product 
router.post('/delete-product',isAuth,adminController.postDeleteProduct)

// // exports.routes = router;
// // exports.products = products;

module.exports = router;