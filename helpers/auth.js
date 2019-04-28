module.exports ={
    ensureAuth:function(req,res,next){
        if(req.isAuthenticated())
        {
            return next();
        }
        req.flash('err_msg','not authreizied')
        res.redirect('/users/login');
    },
}