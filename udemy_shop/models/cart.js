const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {

    static addProduct(id, productPrice){
        //Fetch the previous cart
        fs.readFile(p,(err,fileContent)=>{
            let cart = {products:[] , totalPrice:0}
            if(!err){
                cart= JSON.parse(fileContent);
            }

            //analyze the cart => find exist product
            const existingProductIndex = cart.products.findIndex(prod=> prod.id == id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            //add new product/increase quantity
            if(existingProduct){
                updatedProduct = { ...existingProduct};
                updatedProduct.qty = updatedProduct.qty+1;
                //get previous cart and replace the new product to the previous cart
                cart.products= [...cart.products];
                cart.products[existingProductIndex]= updatedProduct;
            }else{
                updatedProduct = {id:id, qty:1};
                cart.products = [ ...cart.products,updatedProduct];
            }
            //increase price and write to the file
            cart.totalPrice = +cart.totalPrice + +productPrice;
            fs.writeFile(p,JSON.stringify(cart),(err)=>{
                console.log(err);
            });
        });
        
        
    };

    static deleteById(id,productPrice){
        fs.readFile(p,(err,fileContent)=>{
            if(err){
                return;
            }
            console.log(id)
            console.log('came to delete cart product1')
            const updateCart = { ...JSON.parse(fileContent) }
            console.log('came to delete cart product1')
            console.log(updateCart)
            const product = updateCart.products.find(prod=>prod.id == id);
            //const product = updateCart.products.find(prod=>prod.id===id);
//===========================================================================================
//methanin ehata run wenne na. error eak enneth na
            console.log(product)
            productQty = product.qty;
            console.log(productQty)
            console.log('came to delete cart product2')
            updateCart.products = updateCart.products.filter(
                prod=> prod.id !== id
            );
            updateCart.totalPrice = updateCart.totalPrice-productPrice*productQty;
            console.log(updateCart)
            fs.writeFile(p,JSON.stringify(updateCart),(err)=>{
                console.log(err);
                if(!err){
                    console.log('succesfully update cart');
                }
                
            });
        });
    }
};