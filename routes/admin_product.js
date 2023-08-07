var express = require("express");
var { body, validationResult } = require('express-validator');
var router = express.Router();
var Product = require('../models/product');
var Category = require('../models/categories');
var flash = require('connect-flash');
var session = require('express-session'); 
var fs = require('fs-extra');
const multer  = require('multer')
var path = require("path");
const product = require("../models/product");

router.use(express.json());

//middleware for multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/product_image')
  },
  filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

 const maxSize = 1 * 1024 * 1024;

var upload = multer({ 
  storage: storage, 
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
  limits: function() { fileSize: maxSize }
}).single('file');




// {
//   fieldname: 'file',
//   originalname: 'cookies_pic.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   destination: './public/product_image',
//   filename: 'file-1656157573514.png',
//   path: 'public\\product_image\\file-1656157573514.png',
//   size: 188762
// }



router.get('/', function(req, res){
    //res.sendFile(__dirname + "/index.html");
    res.render('index')
});
router.get("/login",function(req, res){
    //res.sendFile(__dirname + "/index.html");
    res.render('login')
});

//total no. of product present 


router.get('/View-product', function(req, res){
    var count;
    Product.count(function(err, c){
    count = c;
    });

  Product.find(function(err, product){
    res.render('admin/view_product',{
      product: product,
      count: count
    });
  });
});


router.post('/View-product', function(req, res){
  var ids = req.body['id'];
  console.log(ids)
  var count = 0;
  var ID = ids.length;

  for (var i = 0; i < ID; i++) {
    var id = ids[i]
    count++;

    (function(count){

    
  
    Category.findById(id, function(err, category){
      category.sorting = count;
      category.save(function(err, page){
        if(err)
          return console.log(err)


      });
    });
  })(count);
  }

});

//add product

router.get('/add-product', function(req, res, next){
    var title = "";
    var desc = ""; 
    var price = "";
    Category.find(function(err, category){
        res.render('admin/add_product', {
            title: title,
            desc: desc,
            category: category,
            price: price
            
        }); 
    });
    
});

router.post('/add-product',upload,
        body('title').notEmpty().withMessage("Title should not be empty"),
        body('desc').notEmpty().withMessage("Description should not be empty"),
        body('category').notEmpty().withMessage("Category should not be empty"),
        body('price').isDecimal().withMessage("Price should not be empty"),
        //body('image').notEmpty().withMessage("Image should not be empty"),
        function (req, res, next) {
          
         
            // upload(req, res, (err)=> {
            //   if (err instanceof multer.MulterError) {
            //     // A Multer error occurred when uploading.
            //     res.send(err)
            //   } else if (err) {
            //     // An unknown error occurred when uploading.
            //     res.send(err)
            //   }
            //   // Everything went fine.
            //   console.log(req.file)
            console.log(req.file)


             var errors = validationResult(req);
             var title = req.body.title;
             var slug = title.replace(/\s+/g, '-').toLowerCase();
             var desc = req.body.desc;
             var category = req.body.category;
             var price = req.body.price;
             var image = req.file;

             

          if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            const alert = errors.array()
            Category.find(function(err, category){
              res.render('admin/add_product',{
                alert: alert,
                title: title,
                desc: desc,
                price: price,
                category: category
          }); 
        });

          }else {
         Product.findOne({slug: slug,}, function(err, product){
               if(product){
               req.flash("danger", "page slug exists, choose another,");
                Category.find(function(err, category){
                 res.render('admin/add_product',{
                   title: title,
                     desc: desc,
                    image: image,
                    price: price,
                     category: category
              }); 
          });
       }else{ 
           var price2  = parseFloat(price).toFixed(2);
         var product = new Product({
              title: title,
              slug: slug,
              desc: desc,
              price: price2,
              categories: category,
              image:req.file.filename,
              sorting: 100
         });
          
         product.save(function(err){
           if(err)
            return console.log(err);

             req.flash("success", "product added!");
              res.redirect('/admin/product/add-product');
            });   
           }
            
             });
           }
        //   //});
         }); 


  //edit pages

router.get('/edit-product/:slug', function(req, res, next){
    Product.findOne({ slug: req.params.slug }, function(err, product){
      if (err)
        return console.log( err);
      if(product){
        Category.find(function(err, category){
          res.render('admin/edit_product', {
            title: product.title,
            desc: product.desc,
            category: category,
            price: product.price,
            image: product.image,
            id: product._id
            });
    });
      }
    });
});

router.post('/edit-product/:id',upload,
        body('title').notEmpty().withMessage("Title should not be empty"),
        body('desc').notEmpty().withMessage("Description should not be empty"),
        body('category').notEmpty().withMessage("Category should not be empty"),
        body('price').isDecimal().withMessage("Price should not be empty"),
        //body('image').notEmpty().withMessage("Image should not be empty"),
        function (req, res, next) {

            
             var errors = validationResult(req);
             var title = req.body.title;
             var slug = title.replace(/\s+/g, '-').toLowerCase();
             var desc = req.body.desc;
             var category = req.body.category;
             var price = req.body.price;
             var image = req.file.filename;
             var id = req.params.id;
            console.log(title, slug, desc, category, price, image, id)


          if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            const alert = errors.array()
            Category.find(function(err, category){
              res.render('admin/edit_product',{
                alert: alert,
                title: title,
                desc: desc,
                price: price,
                image: image,
                category: category,
                id:id
          }); 
        });

          }else {
         Product.findOne({slug: slug, _id:{'$ne':id}}, function(err, product){
                if(err)
                console.log(err)
               if(product){
               req.flash("danger", "page slug exists, choose another,");
                Category.find(function(err, category){ 
                 res.render('admin/add_product',{
                   title: title,
                    desc: desc,
                    image: image,
                    price: price,
                    category: category
              }); 
          });
       }else{ 
          Product.findById(id, function(err, product){
            if(err) console.log(err)
            
              product.title = title;
              product.desc = desc;
              product.categories = category;
              product.price = price;
              product.image = image;
              

         
          
          
          
         product.save(function(err){
           if(err)
            return console.log(err);

             req.flash("success", "product added!");
              res.redirect('/admin/product/add-product');
            });
            });   
           };
            
             });
           };
   
         }); 

  //delete page
  router.get('/delete-product/:id', function(req, res){
    Product.findByIdAndRemove(req.params.id, function(err, product){
      if (err) return console.log(err)
      req.flash("success", "product Deleted!");
      res.redirect('/admin/product/view-product');
    });
  });


module.exports = router;