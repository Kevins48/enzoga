const Item = require('../models/item');
const Cart = require('../models/cart');

// memasukan item ke cart berdasarkan user yang sedang login
const postItem = async (req, res) => {
    itemId = req.params.itemId;
    userId = req.user['user_id'];

    async function addItem() {
        const item = await Item.findOne({
            where: {
                item_id: itemId
            }
        });
        if (!item) {
            return res.json({'Message': 'item not found'});
        }
        if (item.qty === 0) {
            return res.json({'Message': 'item unavailable'});
        }
            
        const cart = await Cart.findOne({
            where: {
                user_id: userId,
                item_id: itemId
            }});
        if (cart) {
            if (item.qty === 0) {
                return res.json({'Message': 'item unavailable'});
            }
            if (cart.qty > item.qty) {
                cart.qty = item.qty;
                return res.json({'Message': 'item maxed out'});
            } else {
                cart.qty += 1;
            }
            await cart.save();
        } else {
            await Cart.create({
                item_id: itemId,
                user_id: userId,
                qty: 1
            });
        }
        return res.json({'Message': '<b>'+ item['nama'] + '-' + item['category'] +'</b> added to cart'});
    }
    return addItem();
}

// menghapuskan sebuah item dari cart
const removeItem = async (req, res) => {
    cartId = req.params.cartId;

    async function remove() {
        const cart = await Cart.findOne({
            where: {
                cart_id: cartId
            }});
        if (!cart) {
            res.redirect('/cart');
        }
        await cart.destroy();

        res.redirect('/cart');
    }
    remove();
}

const checkout = async (req, res) => {
    userId = req.user['user_id'];
    async function checkout() {
        const cart = await Cart.findAll({
            where: {
                user_id: userId
            }
        });
        if (cart.length === 0) {
            return res.redirect('/');
        }
        const items = await Item.findAll({
            where: {
                item_id: cart.map(item => item.item_id)
            }
        });
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total += cart[i].qty * items.find(item => item.item_id === cart[i].item_id)['harga'];
            let it = items.find(item => item.item_id === cart[i].item_id);
            it.qty -= cart[i].qty;
            await it.save();
            await cart[i].destroy();
        }

        res.render('checkout', {total: total});
    }
    checkout();
}

module.exports.register = function (router) {
    router.post('/cart/add/:itemId', postItem);
    router.get('/cart/remove/:cartId', removeItem);
    router.get('/cart/checkout', checkout);
}