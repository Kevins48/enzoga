const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db').db();

class Item extends Model {}

// data item yang dijual toko
Item.init({
    item_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    category: { type: DataTypes.STRING, allowNull: false },
    nama: { type: DataTypes.STRING, allowNull: false },
    harga: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 9000 },
    qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    image_url: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
}, { sequelize, modelName: 'item', freezeTableName: true});

module.exports = Item;

module.exports.initialize = function () {
    Item.create({
        item_id: 1,
        nama: 'Kemeja Putih',
        category: 'Pria',
        harga: 100000,
        qty: 99,
        image_url: 'pria1.jpg',
    });
    Item.create({
        item_id: 2,
        nama: 'Sweater Hitam',
        category: 'Pria',
        harga: 70000,
        qty: 99,
        image_url: 'pria2.jpg',
    });
    Item.create({
        item_id: 3,
        nama: 'Sweater Putih',
        category: 'Pria',
        harga: 50000,
        qty: 99,
        image_url: 'pria3.jpg',
    });
    Item.create({
        item_id: 4,
        nama: 'Jaket Merah',
        category: 'Pria',
        harga: 200000,
        qty: 99,
        image_url: 'pria4.jpg',
    });
    Item.create({
        item_id: 5,
        nama: 'Tracker Pants',
        category: 'Pria',
        harga: 150000,
        qty: 99,
        image_url: 'pria5.jpg',
    });

    Item.create({
        item_id: 6,
        nama: 'Kemeja Putih',
        category: 'Wanita',
        harga: 100000,
        qty: 99,
        image_url: 'wanita1.jpg',
    });
    Item.create({
        item_id: 7,
        nama: 'Sweater Hitam',
        category: 'Wanita',
        harga: 70000,
        qty: 99,
        image_url: 'wanita2.jpg',
    });
    Item.create({
        item_id: 8,
        nama: 'Sweater Putih',
        category: 'Wanita',
        harga: 50000,
        qty: 99,
        image_url: 'wanita3.jpg',
    });
    Item.create({
        item_id: 9,
        nama: 'Hoodie Merah',
        category: 'Wanita',
        harga: 200000,
        qty: 99,
        image_url: 'wanita4.jpg',
    });
    Item.create({
        item_id: 10,
        nama: 'Tracker Pants',
        category: 'Wanita',
        harga: 150000,
        qty: 99,
        image_url: 'wanita5.jpg',
    });

    Item.create({
        item_id: 11,
        nama: 'Kemeja Putih',
        category: 'Anak-anak',
        harga: 100000,
        qty: 99,
        image_url: 'anak1.jpg',
    });
    Item.create({
        item_id: 12,
        nama: 'Sweater Hitam',
        category: 'Anak-anak',
        harga: 70000,
        qty: 99,
        image_url: 'anak2.jpg',
    });
    Item.create({
        item_id: 13,
        nama: 'Sweater Hoodie Putih',
        category: 'Anak-anak',
        harga: 50000,
        qty: 99,
        image_url: 'anak3.jpg',
    });
    Item.create({
        item_id: 14,
        nama: 'Jaket Merah',
        category: 'Anak-anak',
        harga: 200000,
        qty: 99,
        image_url: 'anak4.jpg',
    });
    Item.create({
        item_id: 15,
        nama: 'Jogger Pants',
        category: 'Anak-anak',
        harga: 150000,
        qty: 99,
        image_url: 'anak5.jpg',
    });

    Item.create({
        item_id: 16,
        nama: 'Waistbag',
        category: 'Aksesoris',
        harga: 55000,
        qty: 99,
        image_url: 'tas1.jpg'
    });
    Item.create({
        item_id: 17,
        nama: 'Bucket Hat',
        category: 'Aksesoris',
        harga: 45000,
        qty: 99,
        image_url: 'topi.jpg'
    });
    Item.create({
        item_id: 18,
        nama: 'Syal Hitam',
        category: 'Aksesoris',
        harga: 35000,
        qty: 99,
        image_url: 'syal.jpg'
    });
    Item.create({
        item_id: 19,
        nama: 'Kupluk Hitam',
        category: 'Aksesoris',
        harga: 40000,
        qty: 99,
        image_url: 'kupluk.jpg'
    });
}