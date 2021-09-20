const router = require('express').Router()
const { Post, User, Playlist, Song } = require('../models')
const passport = require('passport')
const { song } = require('.')

router.get('/playlists/:pid/songs', passport.authenticate('jwt'), (req, res) => {
  Song.findAll()
    .then(songs => res.json(songs))
    .catch(err => console.log(err))
})

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