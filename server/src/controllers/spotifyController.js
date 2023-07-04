// Add local environment letiables to process.env
require('dotenv').config({ path: './.env.local' });
// Add global environment letiables to process.env 
require('dotenv').config({ path: './.env' });

// Libraries:
const request = require('request');

// Spotify API info
const client_id = process.env.SPOTIFY_CLIENT_ID;                                      // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;                              // Your client secret
const redirect_uri = `http://localhost:${process.env.CLIENT_PORT}/api/callback/`;     // Your redirect uri

// Our libaries:
// Populate db
const populateDB = require('../populateDB/populateDB');

// Models:
const User = require('../models/User')

// Encode the client app information as a B64 string
const appInfoB64 = (Buffer.from(client_id + ':' + client_secret).toString('base64'));

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

let stateKey = 'spotify_auth_state';
// login to spotify api
const login = (req, res) => {
    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    res.redirect('https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            show_dialog: true,
            response_type: 'code',
            client_id: client_id,
            scope: 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-top-read',
            redirect_uri: redirect_uri,
            state: state
        }).toString()
    );
};

// Get user auth token
const getAuthToken = (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter
    let code = req.query.code || null;
    let state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            new URLSearchParams({
                error: 'state_mismatch'
            }).toString()
        );
    }
    else {
        res.clearCookie(stateKey);
        // Request info object for making a request to the spotify authorization API
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
                scope: 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-top-read',
            },
            headers: {
                'Authorization': `Basic ${appInfoB64}`
            },
            json: true
        };

        // Make a POST request to spotify for the access and refresh tokens
        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                // Take the tokens from the response from spotify
                const access_token = body.access_token;
                const refresh_token = body.refresh_token;

                // Also, need to store the expires_in field of the response, because we would like to keep track of how long the access token can be valid
                const expires_in = (body.expires_in || 3600) * 1000;    // if spotify does not send it for some reason, then default to 1 hour
                // Date.now() is measured in ms, but the expires_in token is in so, convert s to ms

                // Populate the user's database
                populateDB.populateDatabase(access_token).then(({ email }) => {
                    // When database population is finished, pass the all this data back to the browser
                    // First, encode the data as a url string
                    const urlParaameters = new URLSearchParams({
                        access_token: access_token,
                        refresh_token: refresh_token,
                        access_token_expires_in: expires_in,
                        email
                    }).toString();
                    // Redirect the React app to the dashboard, with the access and refresh tokens encoded into the url
                    res.redirect(`/dashboard/#${urlParaameters}`);
                })
            }
            else {
                // Otherwise, redirect the client back to the login page
                // Encode an error message within the uri
                res.redirect('/#' +
                    new URLSearchParams({
                        error: 'invalid_token'
                    }).toString()
                );
            }
        });
    }
};

// Retrieves spotify's refresh token
const getRefreshToken = (req, res) => {
    // Client passes the refresh token into the query of its request
    const refresh_token = req.query.refresh_token;

    // Construct a object for requesting an access token from the spotify API, using the refresh token
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': `Basic ${appInfoB64}`
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
            scope: 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-top-read',
        },
        json: true
    };

    // Make the request to spotify
    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // Get the new access token and its lifetime to send back to the client
            const access_token = body.access_token;
            const expires_in = (body.expires_in || 3600) * 1000;    // if spotify does not send it for some reason, then default to 1 hour
            // Date.now() is measured in ms, but the expires_in token is in s so, convert s to ms
            // On success, return an object with a new access token back to the client
            res.json({
                "success": {
                    'access_token': access_token,
                    'access_token_expires_in': expires_in,
                }
            });
        }
        else {
            // Otherwise, redirect the client back to the login page
            // Encode an error message within the uri
            res.redirect("/#" +
                new URLSearchParams({
                    'error': "Error refreshing token."
                }).toString()
            );
        }
    });
}

// Gets profile info from the user's spotify account
const getCurrentUserProfile = (req, res) => {
    if (!req.headers.authorization) {
        res.statusMessage = "Must provide authorization in request headers"
        res.status(400).end()
        return;
    }

    console.log(req.headers.authorization)

    const access_token = req.headers.authorization;
    const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };

    request.get(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            console.log(body);
            // On success, return an object with the user's profile

            User.findOne({ email: body.email })
                .then((obj) => {
                    if (!obj) {
                        obj = {
                            name: body.display_name,
                            email: body.email,
                            country: body.country,
                            spotifyPremium: body.product === 'premium',
                            isPremium: false,
                            albums: [],
                            songs: [],
                            artists: [],
                            genres: [],
                        };
                        const user = User(obj);
                        user.save();
                    }
                    let {
                        name,
                        email,
                        country,
                        spotifyPremium,
                        isPremium,
                        _id
                    } = obj;

                    // Update the premium status of the object in the user database depending on whether they are premium according to spotify
                    if (body.product === 'premium' && !spotifyPremium) {
                        // The user has upgraded to premium
                        spotifyPremium = 'premium'
                        User.updateOne(
                            { _id },
                            { spotifyPremium: true }
                        )
                    }
                    else if (body.product !== 'premium' && spotifyPremium) {
                        // The user has changed to free
                        spotifyPremium = 'free'
                        User.updateOne(
                            { _id },
                            { spotifyPremium: false }
                        )
                    }
                    else {
                        // The user has not updated their spotify subscription
                        spotifyPremium = spotifyPremium ? 'premium' : 'free';
                    }

                    User.findById(_id).then((user) => {
                        // Send the profile
                        res.json({
                            'display_name': name,
                            'id': body.id,
                            'email': email,
                            'profile_img': body.images.length > 0 ? body.images[0].url : null,
                            'country': country,
                            'product': spotifyPremium,
                            'isPremium': isPremium,
                            'generatedShareLink': user.generatedShareLink
                        });
                    })
                })
                .catch((err) => {
                    console.log("Error retrieving user data")
                    console.log(err)
                    res.json({
                        'error': err
                    })
                })
        }
        else {
            console.log(error);
            // Otherwise, redirect the client back to the login page
            // Encode an error message within the uri
            res.json({
                'error': "Error retrieving user date."
            });
        }
    });
}

// Sets a user to premium status
const togglePremium = (req, res) => {
    if (!req.query.email) {
        res.statusMessage = "Must prove email in request parameters";
        res.status(400).end()
    }

    const email = req.query.email;
    const performAsync = async (email) => {
        try {
            // Find the user object and toggle the premium status
            const userObject = await User.findOne({ email });
            userObject.isPremium = !userObject.isPremium;
            // Save the object
            try {
                await userObject.save();
                console.log(`Toggled ${email}'s premium status`);
                // Return the current premium status of the user
                return userObject.isPremium;
            }
            catch (err) {
                console.log(`Error saving user (${email})`);
                throw err;
            }
        }
        catch (err) {
            console.log(`Error retriving user (${email})`);
            throw err;
        }
    }

    // Perform the async function
    performAsync(email)
        .then(isPremium => {
            res.json({ "success": isPremium })
        })
        .catch((err) => {
            console.log(err);
            res.json({ "error": err })
        });
}

// Refresh user's data by clearing their data from our local database
const refreshUserData = (req, res) => {
    if (!(req.query.email && req.query.access_token)) {
        res.statusMessage = "Must prove email and access token in request parameters";
        res.status(400).end()
    }

    const email = req.query.email;
    const access_token = req.query.access_token;

    // Clears data from local database and updates user's data in database.
    const performAsync = async (access_token, email) => {
        try {
            // Find the user object and toggle the premium status
            const userObject = await User.findOne({ email });

            // First, clear the user's data
            await populateDB.clearUserData(userObject);

            // Then, update data
            await populateDB.updateDataForUser(access_token, userObject);

            // Save the object
            try {
                const newUser = await User.findOne({ email });
                console.log(`Updated ${email}'s data`);
                // Return the current premium status of the user
                return;
            }
            catch (err) {
                console.log(`Error saving user (${email})`);
                throw err;
            }
        }
        catch (err) {
            console.log(`Error retriving user (${email})`);
            throw err;
        }
    }

    // Perform the async function
    performAsync(access_token, email)
        .then(() => {
            res.json({ "success": true })
        })
        .catch((err) => {
            console.log(err);
            res.json({ "error": err })
        });
};

module.exports = {
    generateRandomString,
    login,
    getAuthToken,
    getRefreshToken,
    getCurrentUserProfile,
    togglePremium,
    refreshUserData
}