const Product = require('../models/product');
const Cart = require('../models/cart')


exports.getProducts= (req, res, next) => {
    Product.fetchAll(products=>{
        res.render('shop/product-list', { 
            prods: products, 
            pageTitle: 'All Products',
            path: '/products', 
            
        });
    });
 //   console.log(products)
   
    
};

exports.getProduct= (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId,product=>{;
        console.log(product)
        res.render('shop/product-detail',{
            product:product,
            pageTitle: product.title,
            path: '/products'
        });

    });
    
};

exports.getIndex = (req,res,next)=>{
    Product.fetchAll(products=>{
        res.render('shop/index', { 
            prods: products, 
            pageTitle: 'Shop', 
            path: '/', 
            //hasProducts: Products.length>0
            
        });
    });
};


exports.getCart = (req,res,next)=>{
    res.render('shop/cart',{
        path: '/cart',
        pageTitle: 'Your Cart'
    });
};
//============================================================================
exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    console.log('hi')
    console.log(req.body.productId);
    console.log(prodId)
    console.log('bye')
    Product.findById(prodId,product=>{
        console.log(prodId)
        console.log('hi 3')
        console.log(product)
        console.log('hi 4')
        Cart.addProduct(prodId,product.price);
    });
    res.redirect('/cart');
};



exports.getCheckout=(req,res,next)=>{
    res.render('/shop/checkout',{
        path:'/checkout',
        pageTitle:'Checkout'
    });
};

exports.getOrders = (req,res,next)=>{
    res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};