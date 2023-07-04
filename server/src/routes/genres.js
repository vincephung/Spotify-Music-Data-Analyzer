const express = require('express');
const router = express.Router();
const { getTopGenres } = require('../controllers/genreController');

// Top 5 listened genres
router.get('/top', getTopGenres);

module.exports = {
    router: router
}