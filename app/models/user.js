const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs')
const sequelize = require('../db').db();

class User extends Model {}

// data user
User.init({
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    nama_depan: { type: DataTypes.STRING, allowNull: false },
    nama_belakang: { type: DataTypes.STRING },
    user_type:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // User type 0 adalah admin sementara diluar itu adalah user biasa
    user_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true}, 
}, { sequelize, modelName: 'user'})

module.exports = User;

module.exports.createAdmin = function(username, password, email, front_name, last_name = null) {
    User.create({
        username: username,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
        email: email,
        user_type: 0,
        nama_depan: front_name,
        nama_belakang: last_name
    })
}
