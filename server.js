// boilerplate login server info
// getting the secret key from .env
require('dotenv').config()
// bringing in express, path, passport, and models
const express = require('express')
const { join } = require('path')
const passport = require('passport')
const { User, Post } = require('./models')
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')

const app = express()

app.use(express.static(join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// initializing passport session
app.use(passport.initialize())
app.use(passport.session())
// allowing creating a user
passport.use(User.createStrategy())
// allowing serializing and deserializing user
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// web token strategy from jwt request and secret key with matching id
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
  // finding user and including their posts
}, ({ id }, cb) => User.findOne({ where: { id }})
  .then(user => cb(null, user))
  .catch(err => cb(err, null))))

app.use(require('./routes'))
app.get('/playlists/:pid', (req, res) => {  
  res.sendFile(join(__dirname, 'public/viewPlaylist.html'))
})
app.get('/create', (req, res) => {
  res.sendFile(join(__dirname, 'public/createPlaylist.html'))
})
app.get('/playlists/:pid/add', (req, res )=> {
  res.sendFile(join(__dirname, 'public/addSongs.html'))
})
// requiring database, syncing, then opening server
require('./db')
  // reset database values with .sync({ force: true })
  .sync()
  .then(() => app.listen(process.env.PORT || 3000))