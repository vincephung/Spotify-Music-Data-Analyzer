const Artist = require('../models/Artist');
let User = require('../models/User');

// API endpoint for getting user's top artists
// req contains: email, offset, and limit
const getTopArtists = async (req, res) => {
    if (!(req.query.email && req.query.offset && req.query.limit)) {
        res.statusMessage = "Must prove email, offset, and limit in request parameters";
        res.status(400).end()
        return;
    }

    // Get artists from DB and return response
    retrieveArtistsFromDB(req.query)
        .then((artists) => {
            // Return success
            res.json({
                "success": artists
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

// Retrieves artists from user based on email, offset and limit
const retrieveArtistsFromDB = async ({ email, offset, limit }) => {
    try {
        // Get the user, by their email address
        const user = await User.findOne({ email });
        const ioffset = parseInt(offset);
        const ilimit = parseInt(limit);

        // Calculate the end based on whether the offset + the limit is within bounds of the album array
        const end = user.artists.length < (ioffset + ilimit)
            ? user.artists.length
            : ioffset + ilimit;

        const artistIds = user.artists.slice(offset, end);
        const artists = await getArtistObjectsFromIds(artistIds)

        // Return the albums
        return artists;
    }
    catch (err) {
        console.log(`Error retrieving user (${email})`)
        throw err;
    }
}


const getArtistObjectsFromIds = async (artistIds) => {
    // Array to store artist objects
    const artists = [];

    for (let index = 0; index < artistIds.length; index++) {
        const obj_id = artistIds[index];
        try {
            // Find the artist and push it to the artists array
            const { name, image, id } = await Artist.findOne({ _id: obj_id });
            console.log(name, image);
            artists.push({
                id: id,
                rank: '' + (index + 1),
                mediaName: name,
                image
            });
        }
        catch (err) {
            console.log(`Error retriving artist (${id})`);
            throw err;
        }
    }
    return artists;
}

module.exports = {
    getTopArtists,
    retrieveArtistsFromDB,
    getArtistObjectsFromIds
}

