const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const adminController = require('../controllers/admin');
const { check, body } = require('express-validator/check');

const router = express.Router();

const isAuth  = require('../middleware/is-auth');

//   /admin/add-product =>GET
router.get('/add-product',isAuth,adminController.getAddProduct);

//   /admin/products =>GET
router.get('/products',isAuth,adminController.getProducts);

//   /admin/add-product =>POST
router.post('/add-product',
    [
        body('title')
            .isLength({min:3})
            .isString()
            .trim(),

        //image

        body('price')
            .isFloat(),

        body('description')
            .isLength({min:3, max: 200})
            .trim()
    ],
    isAuth,
    adminController.postAddProduct
);

router.get('/edit-product/:productId',
    [
        body('title')
            .isLength({min:3})
            .isString()
            .trim(),

        body('price')
            .isFloat(),

        body('description')
            .isLength({min:3, max: 200})
            .trim()
    ],    
    isAuth,
    adminController.getEditProduct
);

//  /admin/edit-product =>POST
router.post('/edit-product',isAuth,adminController.postEditProduct);

// //delete a product 
router.post('/delete-product',isAuth,adminController.postDeleteProduct)

// // exports.routes = router;
// // exports.products = products;

module.exports = router;