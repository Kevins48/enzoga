module.exports.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect(`/login?ref=${req.url}`);
}

// Middleware untuk mengecek apakah user seorang admin
module.exports.isAuthorized = () => {
    return (req, res, next) => {
        if(req.isAuthenticated()){
            if (req.user.user_type == 0){
                return next();
            } else {
                res.redirect('/404');
            }
        } else {
            res.redirect('/404');
        }
    }
}