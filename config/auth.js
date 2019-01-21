module.exports = {
  ensureAuthenticated: function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'ulogujte se da bi ste videli resurs');
    res.redirect('./users/login');
  }
};