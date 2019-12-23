const products = [];
const fs = require('fs');
const path = require('path')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductFromFile=(callBack)=>{

    fs.readFile(p,(err,fileContent)=>{
        if(err){
            //if empty file
            callBack([]);
        }else{
            callBack(JSON.parse(fileContent));
        }
//return not as a string using JSON.parse
        
    });
}

module.exports = class Product {
    constructor(title,imageUrl,description,price) {
        this.title = title;
        this.imageUrl=imageUrl;
        this.description=description;
        this.price=price;
        
    }

    save() {
        this.id = Math.random().toString();
       // console.log('hi2')
        getProductFromFile(products =>{
            products.push(this);
            fs.writeFile(p, JSON.stringify(products),(err)=>{
                console.log(err);
            });
        });

    }

    static fetchAll(callBack) {
     //   console.log('hi')
     getProductFromFile(callBack);
        
    }

    static findById(id,cb){
        getProductFromFile(products =>{
            const product = products.find(p=> p.id==id);
            cb(product);
        })
    }
}
