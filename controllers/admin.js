const Product = require('../models/product');

const {validationResult} =require('express-validator/check')

exports.getAddProduct = (req, res, next) => {
    // if (!req.session.isLoggedIn){
    //     return res.redirect('/login')
    // }
    res.render('admin/edit-product',
        {
            layout: false,
            pageTitle: 'Add Product',
            path: "/admin/add-product",
            editing: false,
            hasError:false,
            errorMessage: null,
            validationErrors: []
            // isAuthenticated: req.session.isLoggedIn
        })
};

exports.postAddProduct = (req, res, next) => {

    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.file;
    const errors = validationResult(req);
    console.log(imageUrl)

    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(422).render('admin/edit-product',
                {
                    pageTitle: 'Add Product',
                    path: "/admin/edit-product",
                    editing: false,
                    product: {
                        title:title,
                        imageUrl:imageUrl,
                        price:price,
                        description:description
                    },
                    hasError:true,
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array()


                }
            );
    }

    const product = new Product({title:title, price:price, description:description, imageUrl:imageUrl, userId:req.user});
    product.save()
        .then(result => {
            //console.log(result)
            console.log('Created product');
            res.redirect('/admin/products');
            })
            .catch(err => {
                // return res.status(500).render('admin/edit-product',
                // {
                //     pageTitle: 'Add Product',
                //     path: "/admin/add-product",
                //     editing: false,
                //     product: {
                //         title:title,
                //         imageUrl:imageUrl,
                //         price:price,
                //         description:description
                //     },
                //     hasError:true,
                //     errorMessage: 'Database operation failed, Please try again.',
                //     validationErrors:[]
                // });
                // res.redirect('/500');
                const error =  new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
};

exports.getEditProduct = (req, res, next) => {

    // get quary para meters
    const editMode = req.query.edit;
    if (!editMode) {
        console.log('edit mode off')
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            
            if (!product) {
                console.log('sry')
                return res.redirect('/');
            }
            // product is exsist
            res.render('admin/edit-product',
                {
                    pageTitle: 'Edit Product',
                    path: "/admin/edit-product",
                    editing: editMode,
                    product: product,
                    hasError:false,
                    errorMessage: null,
                    validationErrors: []

                }
            );
        }).catch(err => {
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        //meke mokakhari aulak thiyeno============
        console.log(errors)
        return res.status(422).render('admin/edit-product',
                {
                    pageTitle: 'Edit Product',
                    path: "/admin/edit-product",
                    editing: true,
                    product: {
                        title:updatedTitle,
                        imageUrl:updatedImageUrl,
                        price:updatedPrice,
                        description:updatedDescription,
                        _id:prodId
                    },
                    hasError:true,
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array()


                }
            );
    }

    Product.findById(prodId)
        .then(product=>{
            if(product.userId.toString() !== req.user._id.toString()){
                return res.redirect('/')
            }
            product.title=updatedTitle,
            product.price=updatedPrice,
            product.updatedImageUrl=updatedImageUrl,
            product.description=updatedDescription
            return product.save()
                .then(result => {
                    console.log('UPDATED PRODUCT!');
                    res.redirect('/admin/products');
                })
        })  
        .catch(err => {
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    prodId = req.body.productId;
    Product.deleteOne({_id:prodId, userId: req.user._id})
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}

exports.getProducts = (req, res, next) => {
    Product.find({userId:req.user._id})
        // .select('title price -_id')                // which feilds to be select
        // .populate('userId', 'name')         //populate the certain fields not just the id
        .then(products => {
            console.log(products)
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                // isAuthenticated: req.session.isLoggedIn

            });
        })
        .catch(err => {
            const error =  new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}