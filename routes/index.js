const router = require('express').Router()

router.use('/api', require('./userRoutes.js'))
router.use('/api', require('./PlaylistRoutes.js'))
router.use('/api', require('./songRoutes.js'))
router.use('/playlists/api', require('./PlaylistRoutes.js'))
router.use('playlists/api', require('./songRoutes.js'))
router.use('playlists/api', require('./userRoutes.js'))


module.exports = router