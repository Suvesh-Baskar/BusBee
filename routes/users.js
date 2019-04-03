const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load user model
require('../models/User');
const User = mongoose.model('users');

// Login Route
router.get('/login',(req,res)=>{
    res.render('users/login');
});

// Register Route
router.get('/register',(req,res)=>{
    res.render('users/register');
});

// Login form Post
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/tickets/bookDate',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

// Register form POST
router.post('/register',(req,res)=>{
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text:'Passwords do not match'});
    }
    if(req.body.password.length < 4){
        errors.push({text:' Password too small'});
    }

    if(errors.length > 0){
        res.render('users/register',{
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,
        });
    } else {
        User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                errors.push({text:'Email already registered'});
                res.render(res.render('users/register',{
                    errors: errors,
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    password2: req.body.password2,
                }));
            }else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
        
                bcrypt.genSalt(10,(err,salt) => {
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                res.render('users/login',{msg:"Account created successfully"});
                            })
                            .catch(err => {
                                console.log(err);
                                return;
                            })
                    });
                });
            }
        })
        
    }
});

// logout user
router.get('/logout',(req,res) => {
    req.logOut();
    res.render('users/login',{msg:"You are logged out"})
})
module.exports = router;