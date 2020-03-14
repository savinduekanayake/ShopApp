const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

const User = require('../models/user')

router.get('/signup',authController.getSignup);

router.get('/login',authController.getLogin);

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('please enter valid email address')
            .normalizeEmail(),
        body('password', 'Password has to be valid.')
            .isLength({min:5})
            .isAlphanumeric()
            .trim()
    ],   
    authController.postLogin);



router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.') // change the message
            .custom((value,{ req }) =>{     //customize the validation with our own
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                        'E-mail exist already, Please pick a different one.'
                        );
                    }
                });
            })
            .normalizeEmail(),
        body('password',    // check password value in body./we can use check also. 
             'Please enter a password with only numbers and text and at least 5 characters'  //error inteted of .withMessage()
            )    
             .isLength({min:5})
             .trim()
             .isAlphanumeric(),

        body('confirmPassword')
            .trim()
            .custom((value,{ req }) =>{     //customize the validation with our own
                if(value !== req.body.password){
                    throw new Error('Passwords have to match!');
                    
                }
                return true;
            }),

    ],
    authController.postSignup);

router.post('/logout',authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);


module.exports = router;