const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl,id, userId) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this._id = id? new mongodb.ObjectId(id) : null;
        this.userId=userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if(this._id){
            //update the product
            dbOp = db.collection('products')
                .updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this})
        }else{
            dbOp=db.collection('products').insertOne(this)
        }
        //insert the produt
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find()
            .toArray()
            .then(products=>{
                console.log(products);
                return products;
            })
            .catch(err => { console.log(err) });
    }

    static findById(prodId){
        const db = getDb();
        return db.collection('products')
            .find({_id:new mongodb.ObjectId(prodId)})
            .next()
            .then(product=>{
                console.log(product);
                return product;
            })
            .catch(err => { console.log(err) });
    }

    static deleteById(prodId){
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
            .then(result=>{
                console.log('DELETED');
            })
            .catch(err=>console.log(err))
    }
}

module.exports = Product;

































/*const db = require('../util/database');

const Cart = require('./cart');


module.exports = class Product {
    constructor(id,title,imageUrl,description,price) {
        this.id=id;
        this.title = title;
        this.imageUrl=imageUrl;
        this.description=description;
        this.price=price;

    }

    save() {
        return db.execute('INSERT INTO products (title,price,imageURL,description) VALUES (?,?,?,?)',
        [this.title,this.price,this.imageUrl,this.description]
        );
    }

    static deleteById(id){

    };

    static fetchAll() {
        return db.execute('SELECT * FROM products');

    }

    static findById(id){
       return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}
*/