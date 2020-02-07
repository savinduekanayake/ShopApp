const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const parser = require('parse')

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')

const app = express();


app.set('view engine', 'ejs')
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyPaser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))

//==============
app.use((req,res,next)=>{
    User.findById('5e3cfbca23403439a0a0dd9a')
    .then(user=>{
        req.user= new User(user.name,user.email,user.cart,user._id);
        next();
    })
    .catch(err=>console.log(err));
    
}); 

app.use('/admin',adminRoutes);
app.use(shopRoutes);


// not a regular page
app.use('/',errorController.get404);

mongoConnect(()=>{
    // console.log()
     
    app.listen(3000);
})