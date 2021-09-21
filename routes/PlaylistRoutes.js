const router = require('express').Router()
const { Post, User, Playlist } = require('../models')
const passport = require('passport')
const { playlist } = require('.')

router.get('/playlists', passport.authenticate('jwt'), (req, res) => {
  Playlist.findAll({ include: ['u'] } )
  .then(playlists => res.json(playlists))
  .catch(err => console.log(err))
})

router.post('/playlists', passport.authenticate('jwt'), (req, res) => Playlist.create({
  name: req.body.name,
  uid: req.user.id,
  public: false
})
  .then(playlist => Playlist.findOne({ where: { id: playlist.id }, include: 'u'}))
  .then(playlist => res.json(playlist))
  .catch(err => console.log(err))
)

router.put('/playlists/:id', passport.authenticate('jwt'), (req, res) =>
  Playlist.update(req.body, { where: { id: req.params.id } })
  .then(() => res.sendStatus(200))
  .catch(err => console.log(err))
)

router.delete('/playlists/:id', (req, res) => Playlist.destroy({ where: {id: req.params.id } })
  .then(() => res.sendStatus(200))
  .catch(err => console.log(err)))

module.exports = router