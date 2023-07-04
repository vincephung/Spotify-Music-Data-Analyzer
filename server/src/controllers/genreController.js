let Genres = require('../models/Genre');
let User = require('../models/User');

// API endpoint for getting user's top genres
// req contains: email, offset, and limit
const getTopGenres = (req, res) => {
    if (!(req.query.email && req.query.offset && req.query.limit)) {
        res.statusMessage = "Must prove email, offset, and limit in request parameters";
        res.status(400).end()
        return;
    }

    // Perform the async functions
    retrieveGenresFromDB(req.query)
        .then((genres) => {
            // Return success
            res.json({
                "success": genres
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

// Retrieves genresfrom user based on email, offset and limit
const retrieveGenresFromDB = async ({ email, offset, limit }) => {
    try {
        // Get the user, by their email address
        const user = await User.findOne({ email });
        const ioffset = parseInt(offset);
        const ilimit = parseInt(limit);

        // Calculate the end based on whether the offset + the limit is within bounds of the genre array
        const end = user.genres.length < (ioffset + ilimit)
            ? user.genres.length
            : ioffset + ilimit;

        const genreIds = user.genres.slice(offset, end);
        const genres = await getGenreObjectsFromIds(genreIds);

        // Return the genres
        return genres;
    }
    catch (err) {
        console.log(`Error retrieving user (${email})`)
        throw err;
    }

}

const getGenreObjectsFromIds = async (genreIds) => {
    // Array to store genre objects
    const genres = [];

    for (let index = 0; index < genreIds.length; index++) {
        const id = genreIds[index];
        try {
            // Find the genre and push it to the genres array
            const { name } = await Genres.findOne({ _id: id });
            genres.push({
                rank: '' + (index + 1),
                mediaName: name
            });
        }
        catch (err) {
            console.log(`Error retriving genre (${id})`);
            throw err;
        }
    }
    return genres;
}

module.exports = {
    getTopGenres,
    retrieveGenresFromDB,
    getGenreObjectsFromIds
}