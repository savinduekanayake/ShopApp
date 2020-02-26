const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const parser = require('parse')
const mongoose = require('mongoose');
const session = require('express-session');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')

const app = express();


app.set('view engine', 'ejs')
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyPaser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))
app.use(session({secret: 'my secret', resave: false, saveUninitialized:false})); //sigin the hash(secret)

//==============
app.use((req,res,next)=>{
    User.findById('5e5411adfa751627086a53f0')
    .then(user=>{
        req.user= user;
        next();
    })
    .catch(err=>console.log(err));
    
}); 

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);



// not a regular page
app.use('/',errorController.get404);

// mongoConnect(()=>{
//     // console.log()
     
//     app.listen(3000);
// })

mongoose
    .connect('mongodb://savindu:yzQHPrSRuimRVRW6@cluster0-shard-00-00-r106v.mongodb.net:27017,cluster0-shard-00-01-r106v.mongodb.net:27017,cluster0-shard-00-02-r106v.mongodb.net:27017/shop?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
    {useUnifiedTopology: true,useNewUrlParser: true,})
    .then((result)=>{
        User.findOne().then(user=>{
            if(!user){
                const user = new User({
                    name: 'max',
                    email: 'max@gmail.com',
                    cart:{
                        items:[]
                    }
                });
                user.save();
            }
        })
        console.log('CONNECTED!');
        app.listen(3000);
    }).catch(err=>{
        console.log(err);
    })
