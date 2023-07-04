
const express = require('express')
const router = express.Router();
const { setGeneratedLink } = require('../controllers/userController');

// Get shareable link
router.get('/generateShareLink/:userEmail', setGeneratedLink)

module.exports = {
    router: router,
}