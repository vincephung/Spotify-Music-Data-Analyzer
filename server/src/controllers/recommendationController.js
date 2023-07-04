const { retrieveSongsFromDB } = require('../controllers/songController');
const { retrieveArtistsFromDB } = require('../controllers/artistController');
const { retrieveGenresFromDB } = require('../controllers/genreController');
const { getSongRecommendations } = require('../populateDB/spotifyAPICalls');

// Get top song reccomendations.
// Uses spotify API get recommendations call.
// Uses user song, artist and genre data.
// Can only use 5 TOTAL combined songs,artists,genres in a single call.
exports.getTopRecommendations = async function (req, res) {
    if (!(req.query.token && req.query.email && req.query.offset && req.query.limit)) {
        res.statusMessage = "Must provide authentication token, email, offset, and limit in request parameters";
        res.status(400).end();
    }

    try {
        const access_token = req.query.token;

        // Array containing objects of each type.
        // Obtain songs, artists, genres
        let songObjs = await retrieveSongsFromDB(req.query);
        let artistObjs = await retrieveArtistsFromDB(req.query);
        let genreObjs = await retrieveGenresFromDB(req.query);

        // Create a string array containing the spotify IDs of the user's top songs.
        songStrings = [];
        for (let i = 0; i < songObjs.length; i++) {
            // Only get 2 songs
            if (i == 2) {
                break;
            }
            song = songObjs[i];
            songStrings.push(song.id);
        }

        // Create a string array containing the spotify IDs of the user's top artists.
        artistStrings = [];
        for (let i = 0; i < artistObjs.length; i++) {
            // Only get 2 artists
            if (i == 2) {
                break;
            }
            artist = artistObjs[i];
            artistStrings.push(artist.id);
        }

        // Create a string array containing the user's top genres
        genreStrings = [];
        for (let i = 0; i < genreObjs.length; i++) {
            if (i == 1) {
                break;
            }
            // only get 1 genre
            genre = genreObjs[i];
            genreStrings.push(genre.mediaName);
        }

        numRecs = req.query.limit;
        // Spotify song recommendations can ONLY take in 5 total of (songs, artists, genres)
        // Right now it is set to get 2 songs, 2 artists and 1 genre.
        // Returns 10 song reccomendations
        songRecData = await getSongRecommendations(access_token, numRecs, songStrings, artistStrings, genreStrings);

        // array of recommended song objects
        console.log(songRecData.tracks);
        songRecObjs = songRecData.tracks;

        // Array containing songs with parsed data to return
        songRecs = [];

        // Iterate through all of the songs and extract neccessary info: song name, artists, album name, song image, uri
        for (let i = 0; i < songRecObjs.length; i++) {
            songObj = songRecObjs[i];

            curArtists = []
            for (let j = 0; j < songObj.artists.length; j++) {
                curArtist = songObj.artists[j];
                curArtists.push(curArtist.name);
            }

            const curSong = {
                'songName': songObj.name,
                'albumName': songObj.album.name,
                'artists': curArtists,
                'image': songObj.album.images[0].url,
                'uri': songObj.uri
            }
            songRecs.push(curSong)
        }

        res.json({ "songs": songRecs })
    } catch (err) {
        console.log("Error getting song recommendations")
        throw err
    }

};