const Cart = require('../models/cart');
const Item = require('../models/item');

const get = (view) => {
    return (req, res) => {
        if (req.isAuthenticated()) {
            res.render(view);
        } else {
            res.redirect('/login');
        }
    };
}

const getStock = async (req, res) => {
    const itemId = req.params.itemId;
    const item = await Item.findOne({
        where: {
            item_id: itemId
        }
    });
    if (item) {
        return res.json({stock: item['qty']});
    }
    return res.json({stock: 0});
}

const getCartQty = async (req, res) => {
    const itemId = req.params.itemId;
    const userId = req.user['user_id'];
    const cart = await Cart.findOne({
        where: {
            user_id: userId,
            item_id: itemId
        }
    });
    if (cart) {
        return res.json({qty: cart['qty']});
    }
    return res.json({qty: 0});
}

const getCart = async (req, res) => {
    if (req.isAuthenticated()) {
        carts = await Cart.findAll({
            where: {
                user_id : req.user['user_id']
            }
        });

        items = [];
        totalPrice = 0;
        for (let i = 0; i < carts.length; i++) {
            item = await Item.findOne({
                where: {
                    item_id : carts[i]['item_id']
                }
            });

            items.push({url: item['image_url'], name: item['nama'] + ' - ' + item['category'], price: item['harga'], qty: carts[i]['qty'], cart_id: carts[i]['cart_id'], total: item['harga'] * carts[i]['qty']});
            totalPrice += item['harga'] * carts[i]['qty'];
        }

        res.render('cart', { item: items, total: {harga: totalPrice} });
    } else {
        res.redirect('/login');
    }
}

const updateStock = async (req, res) => {
    itemId = req.params.itemId;
    newStock = req.params.newStock;

    item = await Item.findOne({
        where: {
            item_id: itemId
        }
    });

    if (item) {
        item.qty = newStock;
        await item.save();
    }
    return res.json({status: 'success'});
}

module.exports.register = function (router) {
    router.get('/pria', get('pria'));
    router.get('/wanita', get('wanita'));
    router.get('/anak', get('anak'));
    router.get('/aksesoris', get('aksesoris'));
    router.get('/cart', getCart);
    router.get('/stock/:itemId', getStock);
    router.get('/cart/qty/:itemId', getCartQty);
    router.post('/stock/update/:itemId/:newStock', updateStock);
}