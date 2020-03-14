const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');  // sending mails
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check')

const User = require('../models/user');


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        // api_key:'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'
        // api_key: "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"
        api_key:"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"
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
    const errors  = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            // isAuthenticated: false
            errorMessage:errors.array()[0].msg
        });
    }

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
                        to: email,
                        from: 'Shop@node.com',
                        subject: 'Signup succeded!',
                        html: '<h1>You successfully signup</h1>'
                    });
                }
                ).catch(err=> console.log(err))
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

exports.getReset = (req,res,next)=>{
    let message = req.flash('error') //getting from session. then remove
    if(message.length>0){
        message= message[0];
    }else{
        message=null;
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        // isAuthenticated: false
        errorMessage:message
    });
}

exports.postReset =(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex');
        User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    req.flash('error', "No account with that email found!");
                    return res.redirect('/reset');
                }
                //set token to user
                user.resetToken=token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save()
            })
            .then(result=>{
                res.redirect('/');//=================================
                // console.log('hi')
                //sending mail
                transporter.sendMail({
                    to: req.body.email,
                    from: 'shop@node.com',
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}"></a> link to set a new password.</P>

                    `
                })
            })
            .catch(err=>console.log(err))
    });
}

exports.getNewPassword = (req,res,next)=>{
    const token = req.params.token;

    User.findOne({resetToken:token, resetTokenExpiration:{$gt: Date.now()}})
        .then(user=>{

            console.log(user)
            console.log(token)
            
            let message = req.flash('error') //getting from session. then remove
            if(message.length>0){
                message= message[0];
            }else{
                message=null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                // isAuthenticated: false
                errorMessage:message,
                userId:user._id,
                passwordToken: token
            });
        })
        .catch(err=>console.log(err))

    
}

exports.postNewPassword = (req,res,next)=>{
    
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({resetToken:passwordToken, resetTokenExpiration: {$gt: Date.now()},_id:userId})
        .then(user=>{
            resetUser=user;
            return bcrypt.hash(req.body.password,12)
        })
        .then(hashedPassword=>{
            resetUser.password = hashedPassword,
            resetUser.resetToken= null;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        }).then(result=>{
            res.redirect('/login')
        })
        .catch(err=>console.log(err))
}