const User = require('../models/user');

exports.getLogin = (req, res, next) => {
   // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req,res,next)=>{
    User.findById('5e5411adfa751627086a53f0')
        .then(user=>{
            req.session.isLoggedIn=true;
            req.session.user=user;

            req.session.save((err)=>{
                console.log(err);
                res.redirect('/');
            }); // to ensure that session is set befor redirect
            
        })
        .catch(err=> console.log(err));
}

exports.getSignup = (req,res,next)=>{
    res.render('auth/signup',{
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated:false
    });
}

exports.postSignup = (req,res,next)=>{

}

exports.postLogout = (req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    })
}