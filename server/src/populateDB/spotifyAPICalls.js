const fetch = require('node-fetch');

/*
Fetch logged in user's data
Parameters:
    type : {String} , either "tracks" or "artists"
    offset: {Int}, The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.
    limit: {Int}, Max # of items to return. Min: 0, Max: 50.
*/
const getTopData = async (type, offset, limit, token) => {
    const url = `https://api.spotify.com/v1/me/top/${type}?time_range=long_term&limit=${limit}&offset=${offset}`;
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': "application/json",
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.json();
}

// Calls spotify API to get an artist's data
const getArtistData = async (href, token) => {
    const response = await fetch(href, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': "application/json",
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.json();
}

// Calls spotify API to get an user's data
const getUserData = async (token) => {
    const url = 'https://api.spotify.com/v1/me';
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': "application/json",
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.json();
}

// Calls spotify API to get a user's song recommendations
const getSongRecommendations = async (token, limit, tracks, artists, genres) => {
    const url = `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_artists=${artists}&seed_genres=${genres}&seed_tracks=${tracks}`;
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': "application/json",
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.json();
}

module.exports = { getTopData, getArtistData, getUserData, getSongRecommendations };