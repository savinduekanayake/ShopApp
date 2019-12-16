const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const parser = require('parse')

//import handleBar template
const expressHbs = require('express-handlebars');

const app = express();

//for handle bar you need to implement app.engine
app.engine('hbs',
expressHbs({layoutsDir: 'views/layouts',defaultLayout:'main-layout', extname:'hbs'}))

// dynamic template
app.set('view engine','hbs');
//app.set('view engine','pug');
app.set('views','views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyPaser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminData.routes);
app.use(shopRoutes);


// not a regular page
app.use('/',(req,res,next)=>{
    res.status(404).render('404',{layout:false, pageTitle:'Page not found'});
});

//layout:false need when handlebar use. otherwise occuring errors


app.listen(3000);
