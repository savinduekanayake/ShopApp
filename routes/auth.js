const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login',authController.getLogin);

router.post('/login',authController.postLogin);

router.get('/signup',authController.getSignup);

router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.') // change the message
            .custom((value,{ req }) =>{     //customize the validation with our own
                if(value === 'test@test.com'){
                    throw new Error('This email address is forbidden');
                    
                }
                return true;
            }),
        body('password',    // check password value in body./we can use check also. 
             'Please enter a password with only numbers and text and at least 5 characters'  //error inteted of .withMessage()
            )    
             .isLength({min:5})
             .isAlphanumeric()   
    ],
        authController.postSignup);

router.post('/logout',authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);


module.exports = router;