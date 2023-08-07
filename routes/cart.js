const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/categories");
var { body, validationResult } = require('express-validator');
var session = require('express-session');
var Signup = require('../models/singup');
var flash = require('connect-flash');


router.get("/add/:product",function(req, res){
    var slug = req.params.product;
    
    Product.findOne({slug: slug}, function(err,p){
        if(err)
        console.log(err);
        if(typeof req.session.Cart == "undefined"){
            req.session.Cart = [];
            req.session.Cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image:'/product_image/'+p.image
            })
        }else{
            var cart = req.session.Cart;
            var newItem = true;
            for (let i = 0; i < cart.length; i++){
                if(cart[i].title == slug){
                    cart[i].qty++;
                    newItem = false;
                    break;
                }

            }   
            if(newItem){
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image:'/product_image/'+p.image
                })
            } 
            }
            console.log(req.session.Cart);
            req.flash('success', 'Product added');
            res.redirect('back');
        
    })
});
router.get("/checkout",async function(req, res){
    if (req.session.Cart && req.session.Cart.length == 0) {
        delete req.session.Cart
        req.flash('success', 'Cart cleared !');
        res.redirect('/cart/checkout')
        
    }else{
        res.render('checkout',{
            title: 'Checkout',
            cart: req.session.Cart
         })
    }

            })
router.get("/clear",async function(req, res){
    
    delete req.session.Cart
    req.flash('success', 'Cart cleared !');
    res.redirect('/cart/checkout')
            })

router.get("/update/:product",async function(req, res){
    var slug = req.params.product;
    var cart = req.session.Cart;
    var action = req.query.action;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if(cart[i].qty < 1)
                    cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.lenght == 0) {
                        delete req.session.cart;
                    }
                    break;
                default:
                    console.log('update problem')
                    break;
            }
            break;
        }
        
    }
    req.flash('success', 'Cart Updated');
    res.redirect('back');
            })

module.exports = router;