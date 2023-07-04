const express = require('express');
const router = express.Router();
let spotifyController = require('../controllers/spotifyController');

// Login using spotify auth
router.get('/login', spotifyController.login);

// Get auth token from spotify
router.get('/callback', spotifyController.getAuthToken);

// Get the refresh token
router.get('/refresh_token', spotifyController.getRefreshToken);

// Get user profile
router.get('/profile', spotifyController.getCurrentUserProfile);

// Toggle user premium status
router.get('/togglePremium', spotifyController.togglePremium);

// Refresh user data
router.get('/refresh', spotifyController.refreshUserData);

module.exports = {
    router: router
}