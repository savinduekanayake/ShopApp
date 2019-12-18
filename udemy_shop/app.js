const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const parser = require('parse')

const errorController = require('./controllers/error')

const app = express();


app.set('view engine', 'ejs')
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyPaser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminRoutes);
app.use(shopRoutes);


// not a regular page
app.use('/',errorController.get404);

//layout:false need when handlebar use. otherwise occuring errors


app.listen(3000);
