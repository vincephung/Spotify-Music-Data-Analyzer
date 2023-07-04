const Artist = require('../models/Artist');
const Album = require('../models/Album');
const User = require('../models/User');

// API endpoint for getting user's top albums
// req contains: email, offset, and limit
const getTopAlbums = (req, res) => {
    if (!(req.query.email && req.query.offset && req.query.limit)) {
        res.statusMessage = "Must prove email, offset, and limit in request parameters";
        res.status(400).end()
        return;
    }

    // Retrieves albums from user based on email, offset and limit
    const retrieveAlbumsFromDB = async ({ email, offset, limit }) => {
        try {
            // Get the user, by their email address
            const user = await User.findOne({ email });
            const ioffset = parseInt(offset);
            const ilimit = parseInt(limit);

            // Calculate the end based on whether the offset + the limit is within bounds of the album array
            const end = user.albums.length < (ioffset + ilimit)
                ? user.albums.length
                : ioffset + ilimit;

            const albumIds = user.albums.slice(offset, end);
            const albums = await getAlbumObjectsFromIds(albumIds);

            // Return the albums
            return albums;
        }
        catch (err) {
            console.log(`Error retrieving user (${email})`)
            throw err;
        }

    }

    // Retrieves albums and sends responses
    retrieveAlbumsFromDB(req.query)
        .then((albums) => {
            // Return success
            res.json({
                "success": albums
            })
        })
        .catch((err) => {
            console.log(err)
            // Return failure
            res.json({
                "error": err
            })
        });
}

// Retrieve album objects based on their IDs
const getAlbumObjectsFromIds = async (albumIds) => {
    // Array to store album objects
    const albums = [];

    for (let index = 0; index < albumIds.length; index++) {
        const album_id = albumIds[index];
        try {
            // Find the album and push it to the albums array
            const { name, artists, image, id } = await Album.findOne({ _id: album_id });
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

            // Rename the fields to reflect the fields used in the client app and push the album to the array
            albums.push({
                rank: '' + (index + 1),
                mediaName: name,
                creators: artistNames,
                id: id,
                image
            });
        }
        catch (err) {
            console.log(`Error retriving album (${album_id})`);
            throw err;
        }
    }

    return albums;
}



module.exports = {
    getTopAlbums,
    getAlbumObjectsFromIds
}