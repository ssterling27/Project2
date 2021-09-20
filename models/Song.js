const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Song extends Model { }

Song.init({
  title: DataTypes.STRING,
  artist: DataTypes.STRING,
  album: DataTypes.STRING,
  mood: DataTypes.STRING,
  link : DataTypes.STRING,
  pid: DataTypes.INTEGER
}, { sequelize, modelName: 'song' })

module.exports = Song