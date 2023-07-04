import './css/songRecPage.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Recommendation from './../components/Recommendation'
import { useEffect, useState } from "react";
import { checkTokens } from '../manageTokens';
import { Button } from 'react-bootstrap';
import SpotifyPlayer from 'react-spotify-web-playback';

const SongRecPage = () => {
    // check user auth tokens
    useEffect(checkTokens, [])

    const [play, setPlay] = useState(false);

    //get user's info
    const profile =  JSON.parse(
            window.sessionStorage.getItem('userProfile')
    )

    const premium = profile.isPremium;

    let accessToken = localStorage.getItem('access_token');
    // Number of recommendations shown
    const limit = 50; 

    // Create the "loading" elements
    const loading = []
    for (let index = 0; index < limit; index++) {
        loading.push({
            loading: true
        });
    }

    // State to contain recommended songs
    const [songs, setSongs] = useState(loading);

    // State to contain current uri being played
    const [uri, setUri] = useState(null);

    // Settings for slideshow
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
    };

    const playerStyle = {
        backgroundColor: "#373737",
        borderTop: "1px solid #E7E7E7",
        textAlign: "center",
        padding: "0px",
        position: "fixed",
        left: "0",
        bottom: "0",
        height: "60px",
        width: "100%"
    };

    // Get song reccomendations from server
    useEffect(()=>{
        const performAsync = async() => {
            const token = localStorage.getItem('access_token');
            const { email } = profile;
            const offset = 0;
            const songRecJSON = await fetch(`/api/recommendations/top?email=${email}&offset=${offset}&limit=${limit}&token=${token}`);
            const songRecResult = await songRecJSON.json();
            console.log(songRecResult)

            if (songRecResult["error"]){
                // Error check
                console.log("Error song rec data");
                console.log(songRecResult["error"])
                return;
            }
            setSongs(songRecResult.songs);
            setUri(songRecResult.songs[0].uri)
        }

        performAsync()
        .then()
        .catch(err=>{
            console.log("Error retrieving data");
            console.log(err);
        })

    },[]);

    // Event listener that sets the current uri to be played in the spotify web player
    window.addEventListener('popstate', () => {
        setUri(window.location.hash.substring(1)); 
        setPlay(true);
    });


    // If user is a premium user this style is applied to the main div
    let standardStyle= {  
                height: "100vh", 
                overflow: "hidden"
                }
    //Otherwise, blur is applied to main div
    if (!premium){
        standardStyle={filter: "blur(1.0rem)"}
    }

    function updatePlayState(state){
        if(!state.isPlaying){
            setPlay(false);
            setUri(null);
        }
    }

    return (
        <>
            <div style={standardStyle}>
                <div className="recTitle">
                    Recommendations
                </div>
                <Slider className="slider" {...settings} >
                    {   
                        songs.map((rec) => {
                            return <Recommendation
                                key={rec.songName}
                                { ...rec } 
                            />
                        })
                    }
                </Slider>
                <div style={playerStyle}>
                        <SpotifyPlayer token={accessToken}
                            uris={uri} play={play} callback={(state) => (updatePlayState(state))}
                            styles={{
                                activeColor: '#fff',
                                bgColor: '#333',
                                color: '#fff',
                                loaderColor: '#00B2FF',
                                sliderColor: '#00B2FF',
                                trackArtistColor: '#ccc',
                                trackNameColor: '#fff',
                                height: 60
                            }}
                        />
                    </div>
            </div> 
            {!premium && (
                <div className="standard">
                <div className="text"> Unlock Premium to receive personally tailored playlists based on your top music tastes</div>
                <Button className="unlock" onClick={() => {
                                            window.location.href="/profile"
                                    }}>Unlock</Button>
                </div>
            )}
            
            
            
        </>
    );
}

export default SongRecPage;