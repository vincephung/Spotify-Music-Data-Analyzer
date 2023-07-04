
const express = require('express');
const router = express.Router();
const { getTopSongs } = require('../controllers/songController');

//Top 5 listened songs
router.get('/top', getTopSongs);

module.exports = {
    router: router
}