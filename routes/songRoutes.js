const router = require('express').Router()
const { Post, User, Playlist, Song } = require('../models')
const passport = require('passport')
const { song } = require('.')
const { test } = require('media-typer')
// get request for the songs in a playlist
router.get('/playlists/:pid/songs', passport.authenticate('jwt'), (req, res) => {
  Song.findAll({ where: { pid: req.params.pid }})
    .then(songs => res.json(songs))
    .catch(err => console.log(err))
})
// get request for all songs belonging to a user
const allsongs = []
const playlist_ids = []
router.get('/allsongs', passport.authenticate('jwt'), (req, res) => {
  Playlist.findAll( { include: ['u'] } ) 
  .then(playlists => {
    playlists.forEach(playlist => {
      playlist_ids.push(playlist.dataValues.id)})
      Song.findAll({ where: { pid: playlist_ids } })
        .then(songs => {
          songs.forEach(song => allsongs.key.push(song.dataValues))
          res.json(allsongs)
        })
  }).catch(err => console.log(err))
  })
    

  // .then(() => res.json(allsongs))
  //   Song.findAll({ where: { pid: playlist.id } })
  //   .then(songs => forEach((song) => {
  //     allsongs.push(song)
  //   }))
  //   .catch(err => console.log(err))
  // }))
  // .then(() => res.json(allsongs))
  // .catch(err => console.log(err))

// get request for specific mood
router.get('/playlists/:pid/songs/mood/:mid', passport.authenticate('jwt'), (req, res) => {
  Song.findAll({ where: [ { pid: req.params.pid }, { mood: req.params.mid } ] })
    .then(songs => res.json(songs))
    .catch(err => console.log(err))
})
// post request to add new song
router.post('/playlists/:pid/songs', passport.authenticate('jwt'), (req, res) => Song.create({
  title: req.body.title,
  artist: req.body.artist,
  album: req.body.album,
  mood: req.body.mood,
  link: req.body.link,
  pid: req.params.pid
})
  .then(song => Song.findOne({ where: { id: song.id } }))
  .then(song => res.json(song))
  .catch(err => console.log(err))
)

router.put('/playlists/:pid/songs/:sid', passport.authenticate('jwt'), (req, res) => Song.update({
  title: req.body.title,
  artist: req.body.artist,
  album: req.body.album,
  mood: req.body.mood,
  link: req.body.link,
  pid: req.params.pid
}, {where: { id: req.params.sid }} )
  .then(() => res.sendStatus(200))
  .catch(err => console.log(err))
)

router.delete('/playlists/:pid/songs/:sid', (req, res) => Song.destroy({ where: { id: req.params.sid } })
  .then(() => res.sendStatus(200))
  .catch(err => console.log(err))
)

module.exports = router