const Product = require('../models/product');
const Order = require('../models/order');

const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');
const stripe = require('stripe')('pk_test_MywVhIbjmYhVCeevqnRSZkjx00yMlTsSS7');


const ITEMS_PER_PAGE = 2;

// const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    // console.log(page)
    Product.find()
        .countDocuments()
        .then(numProducts=>{
            // console.log('hi2')
            totalItems=numProducts;
            return Product.find()
                .skip((page-1)*ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            // console.log('hi3')
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE*page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });


};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId)  //findById is replaced in version to findByPk
        .then(product => {
            //console.log(product)
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products',
                isAuthenticated: req.session.isLoggedIn

            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    // console.log(page)
    Product.find()
        .countDocuments()
        .then(numProducts=>{
            // console.log('hi2')
            totalItems=numProducts;
            return Product.find()
                .skip((page-1)*ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            // console.log('hi3')
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE*page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            // console.log('err')
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};


exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()  // to get promize from populate
        .then(user => {
            console.log(user.cart.items)
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log('added to the cart');
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(result => {
            console.log("Deleted from cart")
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}


exports.postOrder = (req, res, next) => {
      // Token is created using Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const token = req.body.stripeToken; // Using Express
  let totalSum = 0;

  
  req.user
        .populate('cart.items.productId')
        .execPopulate()  // to get promize from populate
        .then(user => {
            user.cart.items.forEach(p=>{
                totalSum += p.quantity * p.productId.price;
            });
            
            console.log(user.cart.items)
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } }
            })

            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            order.save();
        }).then(result => {

            const charge = stripe.charges.create({
                amount: totalSum * 100,
                currency: 'usd',
                description: 'Demo Order',
                source: token,
                metadata: { order_id: result._id.toString() }
              });

            console.log('order added')
            return req.user.clearCart();

        }).then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'))
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'))
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf'); //make sure to download as pdf
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('----------------------------');
            let totalPrice=0;
            order.products.forEach(prod => {
                totalPrice+=prod.quantity*prod.product.price;
                pdfDoc.fontSize(14).text(
                    prod.product.title
                    + ' - ' + 
                    prod.quantity + 
                    ' x ' + 
                    '$' + 
                    prod.product.price
                );
            });
            pdfDoc.fontSize(16).text('----------------------------');
            pdfDoc.fontSize(14).text('Total price is : $'+totalPrice);

            pdfDoc.end();

            // fs.readFile(invoicePath, (err,data)=>{
            //     if(err){
            //         return next(err);

            //     }
            //     res.setHeader('Content-Type','application/pdf'); //make sure to download as pdf
            //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
            //     res.send(data);
            // });
            // const file = fs.createReadStream(invoicePath);


            // file.pipe(res);

        })
        .catch(err => next(err))

}

exports.getCheckout = (req,res,next)=>{
    req.user
        .populate('cart.items.productId')
        .execPopulate()  // to get promize from populate
        .then(user => {
            // console.log('hi123')
            const products = user.cart.items;
            let total = 0;
            products.forEach(p=>{
                // console.log(total)
                total += p.quantity*p.productId.price
            })
            console.log(total)
            
            res.render('shop/checkout', {
                path: '/checkout',
                pageTitle: 'Checkout',
                products: products,
                totalSum: total
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}