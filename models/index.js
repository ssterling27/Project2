const User = require('./User.js')
const Playlist = require('./Playlist.js')
const Song = require('./Song.js')

User.hasMany(Playlist, { foreignKey: 'uid'})
Playlist.belongsTo(User, { as: 'u', foreignKey: 'uid'})
Playlist.hasMany(Song, { foreignKey: 'pid', onDelete: 'cascade' })
Song.belongsTo(Playlist, { as: 'p', foreignKey: 'pid'})

module.exports = { User, Playlist, Song }