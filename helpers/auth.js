module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        res.render('users/login',{error:"Not Authorized"});
    }
}