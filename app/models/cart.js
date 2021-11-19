const { Model, DataTypes, Deferrable } = require('sequelize');
const sequelize = require('../db').db();

const User = require('./user');
const Item = require('./item');

class Cart extends Model {}

// data untuk cart
Cart.init({
    cart_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, onDelete: 'CASCADE', references: { model: User, key: 'user_id', deferrable: Deferrable.INITIALLY_IMMEDIATE } },
    item_id: { type: DataTypes.INTEGER, allowNull: false, onDelete: 'CASCADE', references: { model: Item, key: 'item_id', deferrable: Deferrable.INITIALLY_IMMEDIATE } },
    qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { sequelize, modelName: 'cart', freezeTableName: true});

module.exports = Cart;