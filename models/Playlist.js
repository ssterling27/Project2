const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Playlist extends Model { }

Playlist.init({
  name: DataTypes.STRING,
  public: DataTypes.BOOLEAN
}, { sequelize, modelName: 'playlist' })

module.exports = Playlist