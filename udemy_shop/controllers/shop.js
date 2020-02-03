const Product = require('../models/product');
const Cart = require('../models/cart')


exports.getProducts= (req, res, next) => {
    Product.findAll()
        .then(products=>{
            //console.log(products)
            res.render('shop/product-list', { 
                prods: products, 
                pageTitle: 'All Products',
                path: '/products', 
                
            });
        })
        .catch(err=>console.log(err));
    

};

exports.getProduct= (req, res, next) => {
    const prodId = req.params.productId;

    // Product.findAll({where:{id:prodId}})
    //     .then(products=>{
    //         res.render('shop/product-detail',{
    //             product:products[0],
    //             pageTitle: products[0].title,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => console.log(err));

    Product.findByPk(prodId)  //findById is replaced in version to findByPk
        .then(product => {
            //console.log(product)
            res.render('shop/product-detail',{
                product:product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
    
    
};

exports.getIndex = (req,res,next)=>{
    Product.findAll()
        .then(products=>{
            //console.log(products)
            res.render('shop/index', { 
                prods: products, 
                pageTitle: 'Shop', 
                path: '/', 
                //hasProducts: Products.length>0
            });
        })
        .catch(err=>console.log(err));
      
};


exports.getCart = (req,res,next)=>{
    Cart.getCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts = [];
            for(product of products){
                const cartProductData =cart.products.find(prod=> prod.id === product.id);
                if(cartProductData){
                    cartProducts.push({productData : product , qty:cartProductData.qty});
                }
            }
            res.render('shop/cart',{
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
        
        
    });
    
};
//============================================================================
exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    //console.log(prodId)
    //console.log(prodId.split(' ').join(''))
    Product.findById(prodId.split(' ').join(''),product=>{
        //console.log(product)
        Cart.addProduct(prodId,product.price);
    });
    res.redirect('/cart');
};

exports.postCartDelete = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId,product=>{
        Cart.deleteById(prodId,product.price);
        res.redirect('/cart');
    });
    
}


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