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
};