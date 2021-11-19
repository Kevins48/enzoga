const { isAuthorized } = require('../auth');

const Item = require('../models/item');

module.exports.get = async function(req, res) {
    items = await Item.findAll();
    res.render('manage', { items: items});
}

module.exports.register = function (router) {
    router.get('/manage', isAuthorized(), this.get);
}