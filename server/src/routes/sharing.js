const express = require('express')
const router = express.Router();
const { getSharedDataForUser } = require('../controllers/sharingController');

//Get top X song recommendations
router.get('/:key', getSharedDataForUser);

module.exports = {
    router: router
}