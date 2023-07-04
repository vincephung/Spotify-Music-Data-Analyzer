import React from 'react';
import "./css/DataSharingPage.css";
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, InputGroup, FormControl, Form, Button } from 'react-bootstrap'
import { checkTokens } from '../manageTokens'
import defaultImage from './img/profile.png'
import Image from 'react-bootstrap/Image';
import SplitPane from 'react-split-pane';
import { useParams } from 'react-router-dom'
import SharedFavorite from './../components/SharedFavorite';
import ErrorImg from './img/error.jpg'

const DataSharingPage = () => {
    useEffect(checkTokens, [])
    const { key } = useParams();
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
    
    const premium = useState(profile && profile.isPremium);
    const [albums, setAlbums] = useState(loading);
    const [genres, setGenres] = useState(loading);
    const [artists, setArtists] = useState(loading);
    const [songs, setSongs] = useState(loading);
    const [name, setName] = useState("[ LOADING ]");
    const [username, setUsername] = useState("[ LOADING ]");
    const [textKey, setTextKey] = useState("");

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

    useEffect(() => {
        if (profile && key) {
            fetch(`/api/sharing/${key}?email=${profile.email}`)
                .then((result) => {
                    // Convert the returned result to JSON
                    result.json().then((result) => {

                        // Report the error, if it exists
                        if (result["error"]) {
                            console.log(`There was an error getting shared profile for user with key ${key}`)
                            console.log(result["error"])
                            return;
                        }

                        const {
                            songs,
                            artists,
                            albums,
                            genres,
                            name,
                            username
                        } = result["success"];

                        setSongs(songs)
                        setGenres(genres)
                        setArtists(artists)
                        setAlbums(albums)
                        setName(name)
                        setUsername(username)

                    })
                    .catch((err) => {
                        console.log(`There was an error getting shared profile for user with key ${key}`)
                        console.log(err)
                    })
                })
                .catch((err) => {
                    console.log(`There was an error getting shared profile for user with key ${key}`)
                    console.log(err)
                })
        }
       
        if (profile) {
            premium[1](profile.isPremium)
        }
    }, [profile])

    const favoriteSpacing = {
        marginBottom: "6vh",
    }

    let style = { filter: "blur(0)" };
    if (!premium[0]) {
        style = { filter: "blur(1.0rem)" };
    }

    return (
        <> {
            key === undefined
                ? (
                    <>
                        <div style={style}>
                            <Card className="profileCard text-center">
                                <div className="profilePictureDiv">
                                    <Image className="profilePicture" roundedCircle thumbnail src={
                                        ErrorImg
                                    }></Image>
                                </div>
                                <div className="profileText">
                                    <Card.Title>Error!</Card.Title>
                                    <Card.Text></Card.Text>
                                    <Card.Text>Must provide a sharable link key in the url of this page!</Card.Text>
                                    <Form action={`/premium/sharing/${textKey}`}>
                                        <Form.Label htmlFor="basic-url">Enter the key below</Form.Label>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="basic-addon3">
                                                http://localhost/premium/sharing/
                                            </InputGroup.Text>
                                            <FormControl
                                                id="basic-url"
                                                aria-describedby="basic-addon3"
                                                value={textKey}
                                                onChange={(e) => setTextKey(e.target.value)}
                                            />
                                            <Button
                                                type="submit"
                                                variant={
                                                    textKey
                                                        ? "primary"
                                                        : "outline-secondary"
                                                }
                                            >Enter</Button>
                                        </InputGroup>
                                    </Form>
                                </div>
                            </Card>
                        </div>
                        {!premium[0] && (
                            <div className="standard">
                                <div className="text"> Unlock Premium to share your top songs, artists, genres, and albums with friends!</div>
                                <Button className="unlock" onClick={() => {
                                    window.location.href = "/profile"
                                }}>Unlock</Button>
                            </div>
                        )}

                    </>
                )
                : (

                    <>
                        <SplitPane
                            split="vertical"
                            minSize="40%"
                            defaultSize="40%"
                            style={{
                                overflowY: "scroll",
                                marginTop: "6vh",
                                ...style
                            }}

                        >
                            <Card className="profileCard text-center">
                                <div className="profilePictureDiv">
                                    <Image className="sharedProfilePicture" roundedCircle thumbnail src={
                                        (profile && profile.profile_img) || defaultImage
                                    }></Image>
                                </div>
                                <div className="profileText">
                                    <Card.Title>Name: {name}</Card.Title>
                                    <Card.Title>Username: {username}</Card.Title>
                                </div>
                            </Card>
                            <div className="topFive" style={{ marginTop: "12%" }}>
                                <div style={favoriteSpacing}>
                                    <SharedFavorite
                                        type="Songs"
                                        ranks={songs}
                                    />
                                </div>
                                <div style={favoriteSpacing}>
                                    <SharedFavorite
                                        type="Artists"
                                        ranks={artists}
                                    />
                                </div>
                                <div style={favoriteSpacing}>
                                    <SharedFavorite
                                        type="Genres"
                                        ranks={genres}
                                    />
                                </div>
                                <div style={favoriteSpacing}>
                                    <SharedFavorite
                                        type="Albums"
                                        ranks={albums}
                                    />
                                </div>
                            </div>
                        </SplitPane>
                        
                        {!premium[0] && (
                            <div className="standard">
                                <div className="text"> Unlock Premium to share your top songs, artists, genres, and albums with friends!</div>
                                <Button className="unlock" onClick={() => {
                                    window.location.href = "/profile"
                                }}>Unlock</Button>
                            </div>
                        )}
                    </>
                )
        }</>
    );
}

export default DataSharingPage;