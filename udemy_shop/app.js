const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const parser = require('parse')

const errorController = require('./controllers/error')
// const db = require('./util/database')

const sequelize = require('./util/database');
const User = require('./models/user');
const Product = require('./models/product');

const app = express();


app.set('view engine', 'ejs')
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * FROM products')
//     .then(result=>{
//         console.log(result[0],result[1]);
//     })
//     .catch(err=>{
//         console.log(err);
//     });

app.use(bodyPaser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))

//==============
app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>console.log(err));
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);


// not a regular page
app.use('/',errorController.get404);

//layout:false need when handlebar use. otherwise occuring errors


Product.belongsTo(User, {constrains:true, onDelete: 'CASCADE'});
User.hasMany(Product);


sequelize
    //.sync({force: true})
    .sync()
    .then((result)=>{
        return User.findByPk(1);
        //console.log(result);
        console.log('Server is running...')
        
    })
    .then(user=>{
        if(!user){
            return User.create({name: 'Max', email: 'max@gmail.com' });
        }
        return user; 
    })
    .then(user =>{
        // console.log(user);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });

// app.listen(3000);
