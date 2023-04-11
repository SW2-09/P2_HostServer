export {ensureAuthenticated}

function ensureAuthenticated (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/worker/login')
}