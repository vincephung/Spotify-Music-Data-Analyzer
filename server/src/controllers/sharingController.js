
// Add local environment variables to process.env
require('dotenv').config({ path: './.env.local' });

// Add global environment variables to process.env 
require('dotenv').config({ path: './.env' });

const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const User = require('../models/User');

const { getArtistObjectsFromIds } = require('../controllers/artistController')
const { getGenreObjectsFromIds } = require('../controllers/genreController')
const { getAlbumObjectsFromIds } = require('../controllers/albumController')
const { getSongObjectsFromIds } = require('../controllers/songController')

const getSharedDataForUser = (req, res) => {
    // Check to ensure that the key and email fields have been filled
    const key = req.params.key;
    const ownEmail = req.query.email;
    if (!(key && ownEmail)) {
        res.statusMessage = "Must proved email and key in request parameters";
        res.status(400).end()
        return;
    }

    const performAsync = async () => {
        try {
            console.log("key: " + key)
            console.log("ownEmail: " + ownEmail)

            try {
                console.log(`http://localhost:${CLIENT_PORT}/premium/sharing/${key}`)

                let self = await User.find({ email: ownEmail })
                let other = await User.find({ generatedShareLink: key })

                // Report errors if the self or other does not exist
                if (!self) {
                    res.statusMessage = `Couldn't find user with email ${ownEmail}`
                    throw "Invalid email";
                }
                if (!other) {
                    res.statusMessage = `Couldn't find user with share key ${key}`
                    throw "Invalid key";
                }

                self = self[0]
                other = other[0]
                // console.log(other)

                // Report errors if either self or other aren't premium
                if (!self.isPremium) {
                    res.statusMessage = `User with email ${ownEmail} is not premium!`
                    throw "Self is not premium";
                }
                if (!other.isPremium) {
                    res.statusMessage = `User with share link ${key} is not premium!`
                    throw "Other is not premium";
                }

                // Get all the top five albums, artists, generes, and songs from the other user
                const songIds = other.songs.slice(0, 5);
                const albumIds = other.albums.slice(0, 5);
                const artistIds = other.artists.slice(0, 5);
                const genreIds = other.genres.slice(0, 5);

                // Convert the ids into objects
                const artists = await getArtistObjectsFromIds(artistIds);
                const genres = await getGenreObjectsFromIds(genreIds);
                const albums = await getAlbumObjectsFromIds(albumIds);
                const songs = await getSongObjectsFromIds(songIds);

                // Send the above data back to the client
                return {
                    songs,
                    albums,
                    artists,
                    genres,
                    name: other.name,
                    username: other.email
                }
            }
            catch (err) {
                console.log("Error retrieving user data")
                console.log(err)
                throw err;
            }
        }
        catch (err) {
            console.log(`Error retrieving user shared data for user with key ${key}`)
            throw err;
        }
    }

    // Perform the async functions
    performAsync()
        .then((sharedData) => {
            res.json({
                "success": sharedData
            })
        })
        .catch((err) => {
            // Return failure
            res.json({
                "error": err
            })
        });
}

module.exports = {
    getSharedDataForUser
}