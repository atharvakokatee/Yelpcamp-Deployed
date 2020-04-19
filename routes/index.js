const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');
const User = require('../models/user');

router.get('/',(req,res)=>{
    res.render('landing');
});

// show register form
router.get('/register', (req,res)=>{
    res.render('register');
});

// handle signup logic
router.post('/register',(req,res)=>{
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,function(){
            req.flash("success","Welcome to Yelpcamp "+user.username);
            res.redirect('/campgrounds');
        });
    });
});

// show login form
router.get('/login', (req,res)=>{
    res.render('login');
});

// handle login logic
router.post('/login', passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){

});

// logout login
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect('/campgrounds');
});

module.exports = router;