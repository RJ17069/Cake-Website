//jshint esversion: 6
//module install using npm
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var path = require("path");
var mongoose = require('mongoose');
var config = require("./config/database");
var session = require('express-session'); 
var { body, validationResult } = require('express-validator');
var cookieParser = require('cookie-parser'); 
var flash = require('connect-flash');
const multer  = require('multer')
var passport = require('passport')




//init node
var node = express();
node.use(express.json());
node.use(cookieParser());

//set public folder
node.use(express.static(__dirname + '/public'));

//mogodb middleware
mongoose.connect(config.database);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(){
    console.log("mongodb is connected")
});

//express-session middleware
node.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }));
node.use(flash());

//set global error variable
node.locals.errors = null; 

//cateories
const Category = require("./models/categories");
Category.find(function(err,c){
  if(err){
    console.log(err);
  }else{
    node.locals.c = c;
  }
});

//middleware for multer
const storage = multer.diskStorage({
  destination:'image', function (req, file, cb) {
    cb(null, '/public/product_image')
  },
  filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
});

const upload = multer({ storage: storage });


 // connect-flash middleware
//  node.configure(function() {
//   node.use(express.cookieParser('keyboard cat'));
//   node.use(express.session({ cookie: { maxAge: 60000 }}));
//   node.use(flash());
// });

//express-validador middleware
node.post(
    '/user',
    // username must be an email
    body('username').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }),
    (req, res) => {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      User.create({
        username: req.body.username,
        password: req.body.password,
      }).then(user => res.json(user));
    },
  );

//express-messages middleware
node.use(require('connect-flash')());
node.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//passport config
require('./config/passport')(passport);
//passport middleware
node.use(passport.initialize()); 
node.use(passport.session())

node.get('*',function(req,res,next){
  res.locals.Cart = req.session.Cart;
  res.locals.user = req.user || null;
  next();
});



//setup bodyparser
node.use(bodyParser.urlencoded({ extended: true }));
node.use(bodyParser.json());

//Express fileupload middleware
// node.use(fileUpload({
//   useTempFiles : true,
//   tempFileDir : '/tmp/'
// }));

//view engine setup 
node.set("views", path.join(__dirname, "views"));
node.set('view engine', 'ejs');




//set route for user and admin
const AdminPage = require('./routes/admin_pages.js');
const AdminCategories = require('./routes/admin_categories.js');
const AdminProduct = require('./routes/admin_product.js');
const Pages = require("./routes/pages.js");
const Products = require("./routes/products.js");
const Cart = require("./routes/cart.js");

const { connect } = require("http2");


node.use('/admin/page', AdminPage);
node.use('/admin/categories', AdminCategories);
node.use('/admin/product', AdminProduct);
node.use('/', Pages);
node.use('/product', Products);
node.use('/cart', Cart);



//listen in port
node.listen(3000, () => {
        console.log("Listening in Port 3000");
    });
