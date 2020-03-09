const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: "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"
    }
}));

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];
    let message = req.flash('error') //getting from session. then remove
    if(message.length>0){
        message= message[0];
    }else{
        message=null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        // isAuthenticated: req.session.isLoggedIn
        errorMessage: message 
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error','Invalid email or password.')
                return res.redirect('/login');
            }

            bcrypt
                .compare(password, user.password)
                .then(doMatch=>{
                    if(doMatch){
                        req.session.isLoggedIn = true;
                        req.session.user = user;

                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        }); // to ensure that session is set befor redirect
                    }
                    req.flash('error','Invalid email or password.')
                    res.redirect('/login')
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                })
            
        })
        .catch(err => console.log(err));
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error') //getting from session. then remove
    if(message.length>0){
        message= message[0];
    }else{
        message=null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        // isAuthenticated: false
        errorMessage:message
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error','Email exist already,please pick different one.')

                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                    return transporter.sendMail({
                        to:email,
                        from: 'shop@node.com',
                        subject: 'Signup succeded!',
                        html: '<h1>You successfully signup</h1>'
                    })
                    
                }).catch(err=> console.log(err))
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}