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
    constructor(t) {
        this.title = t;
        // console.log('hi1')
        // console.log(t)
    }

    save() {
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
        //methana mehema une kohomada????????
    }
}
