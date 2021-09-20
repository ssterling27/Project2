const pls = require('passport-local-sequelize')
const { DataTypes } = require('sequelize')
const sequelize = require('../db')

// class User extends Model { }

// User.init({
//   username: DataTypes.STRING
// }, { sequelize, modelName: 'user' })

const User = pls.defineUser(sequelize, { username: DataTypes.STRING })

module.exports = User