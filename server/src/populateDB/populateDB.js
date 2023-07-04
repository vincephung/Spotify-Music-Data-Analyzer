// Populates local DB with user spotify data
// These methods run when user first logs in using spotify api.

// Mongoose models
let Song = require('../models/Song');
let Album = require('../models/Album');
let Genre = require('../models/Genre');
let Artist = require('../models/Artist');
let User = require('../models/User');

// Api calls
const spotifyAPICalls = require('./spotifyAPICalls');

// Functions for creating objects for songs / genres / albums / artists

//create album doc given data from a song.
const createAlbumObject = async (spotifyAlbumObject, artistIds) => {
    try {
        // Search for the album in the database
        const doc = await Album.exists({ id: spotifyAlbumObject.id });
        if (doc) {
            // Album already exists -- we can skip
            console.log(`Error: ${spotifyAlbumObject.name} already exists in database`);
            return doc._id;
        }

        // Create an empty album object
        const newAlbum = new Album({
            id: spotifyAlbumObject.id,
            name: spotifyAlbumObject.name,
            image: spotifyAlbumObject.images[0].url,
            artists: artistIds,
            spotifyUrl: spotifyAlbumObject.external_urls[0]
        })

        // Save the album object
        try {
            const doc = await newAlbum.save()
            // Log the success
            console.log(`Successfully created Album ${newAlbum.name}.`);
            return doc._id;
        }
        catch (err) {
            console.log("error" + err);
        }
    }
    catch (err) {
        console.log(err);
    }
}

// Creates genre doc given an artist's genre.
const createGenreObjects = async (genreNames) => {
    // Iterate over every genre in the provided array
    for (let genre of genreNames) {

        try {
            const doc = await Genre.exists({ name: genre });
            if (doc) {
                // If the genre object already exists, skip
                console.log(`${genre} already exists in database`);
                continue;
            }

            // Create an empty genre object
            const newGenre = new Genre({
                name: genre,
                // _id is auto-generated
            });
            console.log(newGenre);

            try {
                // Save the genre to the database
                await newGenre.save()
                console.log("Successfully created genre.");
            }
            catch (err) {
                console.log("error" + err);
            };
        }
        catch (err) {
            console.log(err);
        }
    }
}

// Takes in a list of artist objects
// Creates artist objects in our local database if they do not currently exist.
const createArtistObjects = async (spotifyArtistObjects) => {
    // Array to store the ids for the new artists
    const ids = [];

    for (let artist of spotifyArtistObjects) {
        console.log(artist);
        try {
            let doc = await Artist.exists({ id: artist.id })
            if (doc) {
                // If the artist already exists, skip
                console.log(`Error: ${artist.name} already exists in database`);
                ids.push(doc._id);
                continue;
            }

            if (artist.genres) {
                // Create genre object for this artist
                await createGenreObjects(artist.genres);
            }

            // Artist does not exist yet.
            const newArtist = new Artist({
                id: artist.id,
                name: artist.name,
                spotifyUrl: artist.external_urls[0],
                genres: artist.genres,
                image: artist.images[0].url
            });

            // Save the new artist object
            try {
                const doc = await newArtist.save()
                console.log("Successfully created artist.");
                console.log(newArtist);
                ids.push(doc._id);
            }
            catch (err) {
                console.log("error" + err);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return the idss
    return ids;
}

// Create song / album / genre / artist objects for a user's top songs
const createTopSongObjects = async (offset, limit, token) => {
    try {
        // Get song data from the api
        const data = await spotifyAPICalls.getTopData("tracks", offset, limit, token);

        //no more songs to get
        if (!data || !data.items) {
            console.log("error null");
            return null;
        }

        for (let song of data.items) {
            try {
                // Check for song's existence in the database
                const doc = await Song.exists({ id: song.id });
                if (doc) {
                    // Skip, if the song does exist
                    console.log(`Error: ${song.name} is already in the database`);
                    continue;
                }

                // Create artist objects for each artist of the current song, and store the ids
                // NOTE: genre objects are also created in this function
                const artists = await getArtists(song.artists, token);
                const artistIds = await createArtistObjects(artists);

                // Create an album object for the current song's album, and store the album id
                const album = song.album;
                const albumId = await createAlbumObject(album, artistIds);

                // Create a new empty song object
                const newSong = new Song({
                    id: song.id,
                    name: song.name,
                    spotifyUrl: song.external_urls[0],
                    album: albumId,
                    artists: artistIds,
                    image: song.album.images[0].url
                });

                try {
                    await newSong.save()
                    console.log(`Successfully created song ${newSong.name}`);
                }
                catch (err) {
                    console.log('error' + err);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    catch (err) {
        console.log("An error occured when retrieving song data from API");
        console.log(err);
    }
}

// Create artist / genre objects for a user's top artists
const createTopArtistObjects = async (offset, limit, token) => {
    try {
        const data = await spotifyAPICalls.getTopData("artists", offset, limit, token);

        if (!data || !data.items) {
            //no more songs to get
            console.log("error null");
            return null;
        }

        // Create artists objects from the provided data
        await createArtistObjects(data.items)
    }
    catch (err) {
        console.log('An error occurred while retrieving top artists');
        console.log(err);
    }
}

// Use spotify api to get individual artists and place them into an array.
const getArtists = async (artists, token) => {
    allArtists = [];
    for (let artist of artists) {
        data = await spotifyAPICalls.getArtistData(artist.href, token);
        allArtists.push(data);
    }
    return allArtists;
}

/* Functions for populating user object with database objects */

// Adds songs to an individual user's data
const populateUserTopSongs = async (offset, limit, token, mongoUserObject, albumCollection) => {
    // Make an API call for for the 
    try {
        const data = await spotifyAPICalls.getTopData("tracks", offset, limit, token);

        //no more songs to get
        if (!data || !data.items) {
            console.log("error null song");
            return null;
        }

        // Iterate over the songs and add them to the user's database
        for (let song of data.items) {
            // Add the song's album to the albumCollection
            if (!albumCollection[song.album.id]) {
                // If this song's album has not appeared yet in this list of songs, then set the album count to 0
                albumCollection[song.album.id] = 0;
            }
            // Increment the count for the current album
            albumCollection[song.album.id]++;

            // Search for the current song in the database
            try {
                const doc = await Song.findOne({ id: song.id });
                if (!doc) {
                    console.log('Error song not found!');
                    continue;
                }

                try {
                    // Add song to user model
                    await User.updateOne(
                        { _id: mongoUserObject._id },         // id of the user to update 
                        { $addToSet: { songs: doc } }            // add the song doc to the user's songs fields
                    );

                    console.log(`Added song doc (${doc.name}) to user (${mongoUserObject.email})`);
                }
                catch (err) {
                    console.log("An error occurred while adding song data to user object");
                    console.log(err);
                }
            }
            catch (err) {
                console.log("An error occurred while retrieving song data from the database");
                console.log(err);
            }
        }
    }
    catch (err) {
        console.log("There was an error retrieving the user's top songs:");
        console.log(err);
    }
}

// Adds artists to an individual user's data
const populateUserTopArtists = async (offset, limit, token, mongoUserObject, genreCollection) => {
    // Collect top artist data using the api
    try {
        const data = await spotifyAPICalls.getTopData("artists", offset, limit, token);

        // No more songs to retrieve
        if (!data || !data.items) {
            console.log("error null artist");
            return null;
        }

        // Iterate over every returned item
        for (let artist of data.items) {
            // Add the artist's genres to the genreCollection
            artist.genres.forEach(genreName => {
                if (!genreCollection[genreName]) {
                    // If the genre has not appeared yet in this list of artists, then set the genre count to 0
                    genreCollection[genreName] = 0;
                }
                // Increment the count for the current genre
                genreCollection[genreName]++;
            });

            try {
                // Search for the artist in the database
                const doc = await Artist.findOne({ id: artist.id })
                if (!doc) {
                    console.log('Error artist not found!');
                    continue;
                }

                try {
                    // Add artist to user model
                    await User.updateOne(
                        { _id: mongoUserObject._id },     // user to update
                        { $addToSet: { artists: doc } },     // add the artist to the user's artist field
                    );
                    // console.log(mongoUserObject);
                    console.log(`Added artist doc (${doc.name}) to user (${mongoUserObject.email})`);
                }
                catch (err) {
                    console.log("An error occurred while adding song data to user object");
                    console.log(err);
                }
            }
            catch (err) {
                console.log("There was an error retrieving artist data from the database:");
                console.log(err);
            }
        }
    }
    catch (err) {
        console.log("There was an error retrieving the user's top artists:");
        console.log(err);
    }
}


// General function for populating a user's top Albums or their top Genres, depending on the provided params
const populateUserTopAlbumOrGenre = async (
    token,                      // token for connecting to the spotify API
    mongoUserObject,            // user object
    userModelFieldName,         // field in the user model to add the object to ('albums' or 'genres')
    collection,                 // object collection that maps a genre/album identifier to its listens
    model,                      // Model that is being added to the user object (Album or Genre)
    identifierFieldName         // field name in the above Model for retrieving the identifier
) => {

    // Get all the keys from the retrieved collection
    const sortedIdentifiers = Object
        // Map every album/genre to a new object, containing their name and their amount of listens
        .getOwnPropertyNames(collection).map(identifier => ({
            identifier,
            listens: collection[identifier]     // get the listens for the current album/genre from the album/genre collection
        }))
        // Sort the newly generated objects by the number of listens
        .sort((a, b) => b.listens - a.listens);

    // iterate over the sorted album/genre name and insert them into the user object, one-by-one
    for (let { identifier } of sortedIdentifiers) {
        try {

            // Construct the filter with the identifier name and the identifier
            const filter = {};
            filter[identifierFieldName] = identifier;

            // Search for the album/genre object in the database
            const doc = await model.findOne(filter);
            if (!doc) {
                console.log(`Could not find the ${userModelFieldName} with the id ${identifier}`);
                continue;
            }

            try {

                // object for the field where the doc will be added to
                const userModelField = {};
                userModelField[userModelFieldName] = doc;

                // Add the album/genre to the user 
                await User.updateOne(
                    { _id: mongoUserObject._id },        // user to update
                    { $addToSet: userModelField }        // add the album/genre to the user's album/genres field
                );

                console.log(`Added ${userModelFieldName} doc (${doc.name}) to user (${mongoUserObject.email})`);
            }
            catch (err) {
                console.log(`There was an error adding the retrieved ${userModelField} ${identifier} to ${mongoUserObject.email}'s database`);
                console.log(err);
            }
        }
        catch (err) {
            console.log(`There was an error retriving the requested ${userModelField} ${identifier}`);
            console.log(err);
        }
    }
}

// Populates a user's genre data
const populateUserTopGenres = async (token, mongoUserObject, genreCollection) => {
    await populateUserTopAlbumOrGenre(
        token,
        mongoUserObject,
        'genres',
        genreCollection,
        Genre,
        'name'
    );
}

// Populates a user's album data
const populateUserTopAlbums = async (token, mongoUserObject, albumCollection) => {
    await populateUserTopAlbumOrGenre(
        token,
        mongoUserObject,
        'albums',
        albumCollection,
        Album,
        'id'
    );
}


// Creates a new user in the local database
const createUser = async (token) => {
    // Get user data from spotify 
    const data = await spotifyAPICalls.getUserData(token);

    // Attempt to retrieve the user from the database
    let userData = await User.findOne({ email: data.email }).exec();
    if (userData) {
        // If that user exists in the database already, then report failure and return
        console.log(`User: ${data.display_name} already exists.`);
        return {
            created: false,
            user: userData
        };
    }

    // Create an empty user object
    const newUser = new User({
        name: data.display_name,
        email: data.email,
        country: data.country,
        isPremium: false,
        albums: [],
        songs: [],
        artists: [],
        genres: [],
        // _id is auto generated
    });

    try {
        // Save the new empty user object
        await newUser.save();

        // Report the success
        console.log("Successfully created user");
        console.log(newUser.name, ' ', newUser.email);
        return {
            created: true,
            user: newUser
        };
    }
    catch (err) {
        console.log('error' + err);
        return {
            created: false,
            userData: null
        }
    }
}


const populateDatabase = async (token) => {
    // Create the user
    let { created, user } = await createUser(token);
    if (!created) {
        // If the user was not created, don't continue populating the db
        if (!user) {
            return;
        }
        return user;
    }

    // Update all data for user
    await updateDataForUser(token, user);

    return user;
}

const updateDataForUser = async (token, user) => {
    // Generates object in the mongo database for the user 
    //      top 100 artists and songs (spotify limits to 100)
    // NOTE: album, and genre data will also be created in the process

    // Top artists also generates genre objects
    await createTopArtistObjects(0, 50, token);
    await createTopArtistObjects(50, 49, token);

    // Top songs also generates album, artist, genre objects
    await createTopSongObjects(0, 50, token);
    await createTopSongObjects(50, 49, token);

    // Spotify does not provide data for top genre and top albums, so this data must be 
    //      must be generated from user's other data
    // These collections store data generated from user's other data

    // Map to store user's top genres, generated from their top artists
    // Maps a genre name to a count of how many artists of that genre they listen to 
    const genreCollection = {};

    // Map to store user's top genres, generated from their top artists
    // Maps an album id to a count of how many songs on that album that they listen to 
    const albumCollection = {};

    // Post the user's top artists to their database, and store their top genres in "genreCollection"
    await populateUserTopArtists(0, 50, token, user, genreCollection);
    await populateUserTopArtists(50, 49, token, user, genreCollection);

    // Post the user's top songs to their database, and store their top albums in "albumCollection"
    await populateUserTopSongs(0, 50, token, user, albumCollection);
    await populateUserTopSongs(50, 49, token, user, albumCollection);

    // Post user's top genres, generated from their top artists
    await populateUserTopGenres(token, user, genreCollection);

    // Post user's top albums, generated from their top songs
    await populateUserTopAlbums(token, user, albumCollection);
}

// clear a user's data
const clearUserData = async (user) => {
    try {
        user.artists = [];
        user.albums = [];
        user.genres = [];
        user.songs = [];
        await user.save();
    }
    catch (err) {
        console.log(`Error clearing data for ${user.email}`)
        console.log(err);
    }
}

module.exports = {
    createObjectsFromUserSongs: createTopSongObjects,
    populateDatabase,
    clearUserData,
    updateDataForUser,
    createUser
}
