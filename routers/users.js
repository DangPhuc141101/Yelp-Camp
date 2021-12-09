const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync =  require('../utils/catchAsync'); 
const users = require('../controllers/users');

// Group router
router.route('/register')
    .get(users.index)
    .post(catchAsync(users.createUser));

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);    

/*
router.get('/register', users.index);

router.post('/register', catchAsync(users.createUser));

router.get('/login', users.loginForm); 

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'} ), users.login);

router.get('/logout', users.logout);
*/

module.exports = router;