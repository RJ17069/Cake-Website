var express = require("express");
var { body, validationResult } = require('express-validator');
var router = express.Router();
var Page = require('../models/page');
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

//total no. of page present

router.get('/View-page', function(req, res){
  Page.find({}).sort({sorting: 1}).exec(function(err, page){
    res.render('admin/view_page',{
      page: page
    });
  });
});


router.post('/View-page', function(req, res){
  var ids = req.body['id'];
  console.log(ids)
  var count = 0;
  var ID = ids.length;

  for (var i = 0; i < ID; i++) {
    var id = ids[i]
    count++;

    (function(count){

    
  
    Page.findById(id, function(err, page){
      page.sorting = count;
      page.save(function(err, page){
        if(err)
          return console.log(err)


      });
    });
  })(count);
  }

});

//add page

router.get('/add-page', function(req, res, next){
  // req.flash("danger", "page slug exists, choose another,");
  // req.flash("success", "Page added!");
  // const messages = req.flash()
 
    var title = "";
    var slug = ""; 
    var content = "";
    res.render('admin/add_page', {
        // messages: req.flash(),
        title: title,
        slug: slug,
        content: content
    }); 
});
     
router.post(
        '/add-page',
        body('title').notEmpty().withMessage("Title should not be empty"),
        body('content').notEmpty().withMessage("Content should not be empty"),
        function (req, res, next) {

          const errors = validationResult(req);
          var title = req.body.title;
          var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
          if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
          var content = req.body.content;


          if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            const alert = errors.array()
              res.render('admin/add_page',{
                alert: alert,
                title: title,
                slug: slug,
                content: content
          }); 

          }else {
            Page.findOne({slug: slug}, function(err, page){
              if(page){
                req.flash("danger", "page slug exists, choose another,");
                res.render('admin/add_page',{
                  title: title,
                  slug: slug,
                  content: content,
                  
            });
          }else{
            var page = new Page({
            title: title,
            slug: slug,
            content: content,
            sorting: 100
          });
          
            page.save(function(err){
              if(err)
              return console.log(err);
              req.flash("success", "Page added!");
              res.redirect('/admin/page/add-page');
            });   
          }
            
            });
          }
          
        });


  //edit pages

router.get('/edit-page/:slug', function(req, res, next){
    Page.findOne({ slug: req.params.slug }, function(err, page){
      if (err)
        return console.log(err);
      if(page){
        res.render('admin/edit_page', {
        title: page.title,
        slug: page.slug,
        content: page.content,
        id: page._id
        
    });
      }
      

    });
});

router.post(
  '/edit-page/:slug',
  body('title').notEmpty().withMessage("Title should not be empty"),
  body('content').notEmpty().withMessage("Content should not be empty"),
  function (req, res, next) {

    const errors = validationResult(req);
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.body.id;


    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      const alert = errors.array()
        res.render('admin/add_page',{
          alert: alert,
          title: title,
          slug: slug,
          content: content,
          id: id
    }); 

    }else {
      Page.findOne({slug: slug, _id:{'$ne':id}}, function(err, page){
        if(page){
          req.flash("danger", "page slug exists, choose another,");
          res.render('admin/edit_adder',{
            title: title,
            slug: slug,
            content: content,
            id: id
            
      });
    }else{
      Page.findById(id, function(err, page){
        if(err) return console.log(err);
        page.title = title;
        page.slug = slug;
        page.content = content;

        page.save(function(err){
          if(err)
          return console.log(err);
          req.flash("success", "Page added!");
          res.redirect('/admin/page/view-pages');
        });
      }); 
    }
      });
    }
  });

  //delete page
  router.get('/delete-page/:id', function(req, res){
    Page.findByIdAndRemove(req.params.id, function(err, page){
      if (err) return console.log(err)
      req.flash("success", "Page Deleted!");
      res.redirect('/admin/page/view-pages');
    });
  });


module.exports = router;