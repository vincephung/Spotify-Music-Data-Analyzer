
const express = require('express')
const router = express.Router();
const { getTopArtists } = require('../controllers/artistController');

// Top 5 listened artists
router.get('/top', getTopArtists)

module.exports = {
    router: router,
}