const express = require('express')
const router = express.Router();
const { getTopRecommendations } = require('../controllers/recommendationController');

//Get top X song recommendations
router.get('/top', getTopRecommendations);

module.exports = {
    router: router
}