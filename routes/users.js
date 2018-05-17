const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

// Load User Model
require('../models/User.js');
const User = mongoose.model('users');

// Usr Login Route
router.get('/login', (req, res) => {
   res.render('users/login');
});

// User register Route
router.get('/register', (req, res) => {
   res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
   passport.authenticate('local', {
      successRedirect:'/ideas',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {

   let errors = [];

   // If passwords does not match
   if (req.body.password != req.body.password2) {
      errors.push({text:'Passwords do not match'});
   }

   // If password is too short
   if (req.body.password.length < 4) {
      errors.push({text:'Password must be at least 4 characters'});
   }

   // If fails
   if (errors.length > 0) {
      res.render('users/register', {
         errors: errors,
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         password2: req.body.password2
      });
   } else { // If success
      User.findOne({email: req.body.email})
         .then(user => {
            // If the user already exists
            if (user) {
               req.flash('error_msg', 'Email already registered');
               res.redirect('users/register');
            } else {
               const newUser = new User ({
                  name: req.body.name,
                  email: req.body.email,
                  password: req.body.password
               });

               bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                     if(err) throw err;
                     newUser.password = hash;
                     newUser.save()
                        .then(user => {
                           req.flash('success_msg', 'You are now registered and can log in');
                           res.redirect('/users/login');
                        })
                        .catch(err => {
                           console.log(err);
                           return;
                        });
                  });
               });
            }
         });
   }
});

// Logout User
router.get('/logout', (req, res) => {
   req.logout();
   req.flash('success_msg', 'You are logged out');
   res.redirect('/users/login');
});


module.exports = router;