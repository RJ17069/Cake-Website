var express = require("express");
var { body, validationResult } = require('express-validator');
var router = express.Router();
var Category = require('../models/categories');
var flash = require('connect-flash');
var session = require('express-session'); 



router.use(express.json());

router.get('/', function(req, res){
    //res.sendFile(__dirname + "/index.html");
    res.render('index')
});
router.get("/login",function(req, res){
    //res.sendFile(__dirname + "/index.html");
    res.render('login')
});

//total no. of categories present

router.get('/View-categories', function(req, res){
  Category.find({}).sort({sorting: 1}).exec(function(err, category){
    res.render('admin/view_categories',{
      category: category
    });
  });
});


router.post('/View-categories', function(req, res){
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

//add page

router.get('/add-categories', function(req, res, next){
  // req.flash("danger", "page slug exists, choose another,");
  // req.flash("success", "Page added!");
  // const messages = req.flash()
 
    var title = "";
    var slug = ""; 
    res.render('admin/add_categories', {
        // messages: req.flash(),
        title: title,
        slug: slug,
    }); 
});
     
router.post(
        '/add-categories',
        body('title').notEmpty().withMessage("Title should not be empty"),
        function (req, res, next) {

          const errors = validationResult(req);
          var title = req.body.title;
          var slug = title.replace(/\s+/g, '-').toLowerCase();

          console.log(errors)


          if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            const alert = errors.array()
              res.render('admin/add_categories',{
                alert: alert,
                title: title,
                slug: slug
          }); 

          }else {
            Category.findOne({slug: slug}, function(err, category){
              if(category){
                req.flash("danger", "page slug exists, choose another,");
                res.render('admin/add_categories',{
                  title: title,
                  slug: slug,
                  
            });
          }else{
            var category = new Category({
            title: title,
            slug: slug,
            sorting: 100
          });
          
            category.save(function(err){
              if(err)
              return console.log(err);
              req.flash("success", "Categories added!");
              res.redirect('/admin/categories/add-categories');
            });   
          }
            
            });
          }
          
        });


  //edit pages

router.get('/edit-categories/:slug', function(req, res, next){
    Category.findOne({slug: req.params.slug } , function(err, category){
      if (err)
        return console.log(err);
      if(category){
        res.render('admin/edit_categories', {
        title: category.title,
        slug: category.slug,
        id: category._id
        
    });
      }
      

    });
});

router.post(
  '/edit-categories/:id',
  body('title').notEmpty().withMessage("Title should not be empty"),
  function (req, res, next) {

    const errors = validationResult(req);
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;
    console.log(errors);

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      const alert = errors.array()
        res.render('admin/add_categories',{
          alert: alert,
          title: title,
          slug: slug,
          id: id
    }); 

    }else {
      Category.findOne({slug: slug, _id:{'$ne':id}}, function(err, category){
        if(category){
          req.flash("danger", "page slug exists, choose another,");
          res.render('admin/edit_categories',{
            title: title,
            slug: slug,
            id: id
            
      });
    }else{
      Category.findById(id, function(err, category){
        if(err) return console.log(err);
        category.title = title;
        category.slug = slug;

        category.save(function(err){
          if(err)
          return console.log(err);
          req.flash("success", "Page added!");
          res.redirect('/admin/categories/view-categories');
        });
      }); 
    }
      });
    }
  });

  //delete page
  router.get('/delete-page/:id', function(req, res){
    Category.findByIdAndRemove(req.params.id, function(err, category){
      if (err) return console.log(err)
      req.flash("success", "categories Deleted!");
      res.redirect('/admin/categories/view-categories');
    });
  });


module.exports = router;