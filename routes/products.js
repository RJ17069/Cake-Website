const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/categories");
var { body, validationResult } = require('express-validator');
var session = require('express-session');

var flash = require('connect-flash');



router.get("/",function(req, res){
    var loggedin = (req.isAuthenticated()) ? true : false;
    Product.find(function(err, product){
        if(err)
            console.log(err)
        
        res.render('Cart',{
            product: product,
            loggedin: loggedin
        });
            
    });
    });


router.get("/:category",function(req, res){
    var categoryslug = req.params.category
    Category.findOne({slug: categoryslug}, function(err,c){
        Product.find({categories: categoryslug},function(err, product){
            if(err)
                console.log(err)
            
            res.render('Cart',{
                product: product
            });
                
        });


    })


    });

    module.exports = router;