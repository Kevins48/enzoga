const get = (view) => {
    return (req, res) => {
        res.render(view);
    };
}

// menampilkan halaman rumah dan error 404
module.exports.register = function (router) {
    router.get('/', get('index'))
    router.get('/404', get('404'));
}