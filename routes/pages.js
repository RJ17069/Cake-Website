const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/categories");
var { body, validationResult } = require('express-validator');
var session = require('express-session');

var flash = require('connect-flash');
const user = require("../models/singup");
var passport = require('passport')
var bcrypt = require('bcryptjs');

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next
  }
  res.redirect('/')
}

router.get("/",function(req, res){
    //res.sendFile(__dirname + "/index.html");
    res.render('index')
});

router.get("/login",function(req, res){
  if (res.locals.user) res.redirect('/')
  res.render('login',{
    title: 'Login',

  })
});

router.post("/login",function(req, res, next){
  console.log(req.body.username)
  console.log(req.body.password)
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
}); 


// router.get("/logout", function(req, res, next){
//   req.logout();
//   req.flash('success', 'You are logged out')
//   res.redirect('/')

// });
router.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    req.flash('success', 'You are logged out')
    res.redirect("/");
  });
});


    router.get("/signup",function(req, res){
        var username = "";
        var email = "";
        var pwd = "";
        var cpwd = "";
            res.render('signup',{
            username: username,
            email: email,
            pwd: pwd,
            cpwd:cpwd
            });
        });
    
router.post("/signup",body('username').notEmpty().withMessage('Username should not be a empty field'),
    body('email').notEmpty().withMessage('email should not be a empty field'),
    body('pwd').notEmpty().withMessage('Password should not be a empty field'),
    body('cpwd').notEmpty().withMessage('Confirm Password should not be a empty field'), async function(req, res){
        const errors = validationResult(req);
            var username = req.body.username;
            var email = req.body.email;
            var pwd = req.body.pwd;
            var cpwd = req.body.cpwd;
            var slug = username.replace(/\s+/g, '-').toLowerCase();
            console.log(slug)

    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        const alert = errors.array()
          res.render('signup',{
            alert: alert,
            username: username,
            email: email,
            pwd: pwd,
            cpwd:cpwd
      }); 
    }if( pwd != cpwd ){
        req.flash("danger", "passwords Don't match ");
        res.render('signup',{
            username: username,
            email: email,
            pwd: pwd,
            cpwd: cpwd
          
    });

    }
    
    
    else {
        user.findOne({slug: slug}, async function(err, signup){
          if(signup){
            req.flash("danger", "Username exists, choose another,");
            res.render('signup',{
                username: username,
                email: email,
                pwd: pwd,
                cpwd: cpwd
              
        });
      }else{
        const salt = await bcrypt.genSalt(10)
        pwd = await bcrypt.hash(pwd, salt);
        cpwd = await bcrypt.hash(cpwd, salt)

        console.log(pwd)
        var signup = new user({
            username: username,
            email: email,
            password: pwd,
            confirmPassword: cpwd,
            

                    
      });
      
    signup.save(function(err){
          if(err)
          return console.log(err);
          req.flash("success", "Successfully Signed Up");
          res.redirect('/login');
        });   
      }
        
        });
    }
});

module.exports = router;