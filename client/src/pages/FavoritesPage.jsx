import 'bootstrap/dist/css/bootstrap.min.css';
import Favorite from './../components/Favorite'
import React from 'react';
import { useEffect, useState } from "react";
import { checkTokens } from '../manageTokens'

const favoriteSpacing = {
    marginBottom: "6vh",
}

const Favorites = () => {
    useEffect(checkTokens, [])
    const [profile, setProfile] = useState(() => {
        return JSON.parse(
            window.sessionStorage.getItem('userProfile')
        )
    });

    if (!profile) {
        // Async function to check for the user profile in session storage, and
        //      to set the profile state to that object, when it loads
        const checkForProfile = async () => {
            // Continuously check for user profile in session storage
            const interval = setInterval(() => {

                // Once the item is loaded, set "profile" to that object"
                let newProfile = JSON.parse(sessionStorage.getItem('userProfile'));
                if (newProfile) {
                    setProfile(newProfile)
                    clearInterval(interval)
                }
            }, 250)

        }
        checkForProfile()
    }

    // Create the "loading" elements
    const numberPerFavorite = 5;
    const loading = []
    for (let index = 0; index < numberPerFavorite; index++) {
        loading.push({
            loading: true
        });
    }

    const [albums, setAlbums] = useState(loading);
    const [genres, setGenres] = useState(loading);
    const [artists, setArtists] = useState(loading);
    const [songs, setSongs] = useState(loading);

    // Retrieve user top 5 data
    useEffect(() => {
        const performAsync = async () => {

            // Get the email, offset, and limit
            const { email } = profile;
            const offset = 0;
            const limit = numberPerFavorite;

            // Retrieve album data from the server
            const albumJson = await fetch(`/api/albums/top?email=${email}&offset=${offset}&limit=${limit}`);
            const albumResult = await albumJson.json();

            if (albumResult["error"]) {
                // Error check
                console.log("Error loading album data");
                console.log(albumResult["error"])
                return;
            }

            // Retrieve genre data from the server
            const genreJson = await fetch(`/api/genres/top?email=${email}&offset=${offset}&limit=${limit}`);
            const genreResult = await genreJson.json();

            if (genreResult["error"]) {
                // Error check
                console.log("Error loading genre data");
                console.log(genreResult["error"])
                return;
            }

            // Retrieve artist data from the server
            const artistJson = await fetch(`/api/artists/top?email=${email}&offset=${offset}&limit=${limit}`);
            const artistResult = await artistJson.json();

            if (artistResult["error"]) {
                // Error check
                console.log("Error loading artist data");
                console.log(artistResult["error"]);
                return;
            }

            // Retrieve genre data from the server
            const songJson = await fetch(`/api/songs/top?email=${email}&offset=${offset}&limit=${limit}`);
            const songResult = await songJson.json();

            if (songResult["error"]) {
                // Error check
                console.log("Error loading genre data");
                console.log(songResult["error"])
                return;
            }

            // Set the albums object to the successful result
            setAlbums(albumResult["success"]);
            setGenres(genreResult["success"]);
            setArtists(artistResult["success"]);
            setSongs(songResult["success"]);
        }

        performAsync()
            .then()
            .catch(err => {
                console.log("Error retrieving data");
                console.log(err);
            });
    }, [profile]);

    return (
        <div style={{ marginTop: "12%" }}>
            <div style={favoriteSpacing}>
                <Favorite
                    type="Songs"
                    ranks={songs}
                />
            </div>
            <div style={favoriteSpacing}>
                <Favorite
                    type="Artists"
                    ranks={artists}
                />
            </div>
            <div style={favoriteSpacing}>
                <Favorite
                    type="Genres"
                    ranks={genres}
                />
            </div>
            <div style={favoriteSpacing}>
                <Favorite
                    type="Albums"
                    ranks={albums}
                />
            </div>
        </div>
    );
}


export default Favorites;
