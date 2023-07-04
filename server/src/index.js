
// Add local environment variables to process.env
require('dotenv').config({ path: './.env.local' });

// Add global environment variables to process.env 
require('dotenv').config({ path: './.env' });

// Initialize express
const express = require("express");
const app = express();
const config = require('../config.json');

// Connection to mongoose must be global so that it can be shared across files
global.mongoose = require('mongoose');

// Initialize the connection to mongoose database
const url = `mongodb://${config.dbHost}:${config.dbPort}/${config.testDbName}`;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Report the connection status
mongoose.connection
    .once('open', () => console.log('Connected to the MongoDB database via Mongoose.'))
    .on('error', (error) => {
        console.warn('Error : ', error);
    });

app.get("/api", (req, res) => {
    res.json({ hello: "world" });
});

//api delete endpoint to clear database
app.get("/api/delete", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        // Get all collections
        const collections = await db.listCollections().toArray();

        // Create an array of collection names and drop each collection
        collections
            .map((collection) => collection.name)
            .forEach(async (collectionName) => {
                db.dropCollection(collectionName);
            });

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Import the modules for each of the five main sections
userModule = require('./routes/user');
artistsModule = require('./routes/artists');
albumsModule = require('./routes/albums');
songsModule = require('./routes/songs');
genresModule = require('./routes/genres');
spotifyModule = require('./routes/spotify');
recommendationModule = require('./routes/recommendations');
sharingModule = require('./routes/sharing')

// Use router in user module to handle user-based requests
app.use('/api/user', userModule.router);

// Use router in artists module to handle artists-based requests
app.use('/api/artists', artistsModule.router);

// Use router in albums module to handle albums-based requests
app.use('/api/albums', albumsModule.router);

// Use router in songs module to handle songs-based requests
app.use('/api/songs', songsModule.router);

// Use router in genres module to handle genres-based requests
app.use('/api/genres', genresModule.router);

//router for spotify api authentication
app.use('/api', spotifyModule.router);

// Handle reccomendation requests
app.use('/api/recommendations', recommendationModule.router);

// Handle data sharing requests
app.use('/api/sharing', sharingModule.router);

module.exports = app;