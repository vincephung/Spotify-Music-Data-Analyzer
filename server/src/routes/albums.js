const express = require('express')
const router = express.Router();

const { getTopAlbums } = require('../controllers/albumController');

//Top 5 listened albums
router.get('/top', getTopAlbums);

module.exports = {
    router: router,
}