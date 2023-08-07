exports.isUser = function (req, res, next){
    if(req.isAuthenticated()){
      return next
    }
    req.flash('success', 'please log in')
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated() && res.locals.user.admin == 1){
      
      next();
    }
    req.flash('danger', 'please log in as admin');
    res.redirect('/login');
  }