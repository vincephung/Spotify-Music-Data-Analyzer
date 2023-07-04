let Songs = require('../models/Song');
const Artist = require('../models/Artist');
let User = require('../models/User');

// API endpoint for getting user's top songs
// req contains: email, offset, and limit
const getTopSongs = function (req, res) {
    if (!(req.query.email && req.query.offset && req.query.limit)) {
        res.statusMessage = "Must prove email, offset, and limit in request parameters";
        res.status(400).end()
        return;
    }

    // Retrieves songs and sends responses
    retrieveSongsFromDB(req.query)
        .then((songs) => {
            // Return success
            res.json({
                "success": songs
            })
        })
        .catch((err) => {
            console.log(err)
            // Return failure
            res.json({
                "error": err
            })
        });
};

// Asynchronous helper function to retrieve songs from local DB
const retrieveSongsFromDB = async ({ email, offset, limit }) => {
    try {
        // Get the user, by their email address
        const user = await User.findOne({ email });
        const ioffset = parseInt(offset);
        const ilimit = parseInt(limit);

        // Calculate the end based on whether the offset + the limit is within bounds of the album array
        const end = user.songs.length < (ioffset + ilimit)
            ? user.songs.length
            : ioffset + ilimit;

        const songIds = user.songs.slice(offset, end);
        const songs = await getSongObjectsFromIds(songIds);

        // Return the songs
        return songs;
    }
    catch (err) {
        console.log(`Error retrieving user (${email})`)
        throw err;
    }

}

const getSongObjectsFromIds = async (songIds) => {
    // Array to store song objects
    const songs = [];

    for (let index = 0; index < songIds.length; index++) {
        const obj_id = songIds[index];
        try {
            // Find the song and push it to the songs array
            const { name, artists, image, id } = await Songs.findOne({ _id: obj_id });
            console.log(id);

            const artistNames = [];
            // Now, crossreference all the artists to their names
            for (let artist of artists) {
                try {
                    // Search for the artist and add their name to the artist names list
                    const { name } = await Artist.findOne({ _id: artist });
                    artistNames.push(name);
                }
                catch (err) {
                    console.log(`Error retriving artist (${artist})`);
                    throw err;
                }
            }

            // Rename the fields to reflect the fields used in the client app and push the song to the array
            songs.push({
                id: id,
                rank: '' + (index + 1),
                mediaName: name,
                creators: artistNames,
                image
            });
        }
        catch (err) {
            console.log(`Error retriving song (${id})`);
            throw err;
        }
    }
    return songs;
}

module.exports = {
    retrieveSongsFromDB,
    getTopSongs,
    getSongObjectsFromIds
}