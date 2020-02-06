const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const parser = require('parse')

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');

const app = express();


app.set('view engine', 'ejs')
app.set('views','views');

const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyPaser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))

//==============
app.use((req,res,next)=>{
    // User.findByPk(1)
    // .then(user=>{
    //     req.user=user;
    //     next();
    // })
    // .catch(err=>console.log(err));
});

app.use('/admin',adminRoutes);
// app.use(shopRoutes);


// not a regular page
app.use('/',errorController.get404);

mongoConnect(()=>{
    console.log(client)
    app.listen(3000);
})