import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/allpage.css";
import React from 'react'
import Item from '../components/Item'
import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { checkTokens } from '../manageTokens'
import SpotifyPlayer from 'react-spotify-web-playback';

const PaneHolder = ({ children }) => {
    return <div className="charts">
        <div className="charts-children">
            {children}
        </div>
    </div>
}

const All = ({ type }) => {
    const [items, setItems] = useState([]);
    const [clickedItem, setClickedItem] = useState(0);
    const [itemType, setItemType] = useState(0);
    const [play, setPlay] = useState(false);
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


    let accessToken = localStorage.getItem('access_token');
    // UseEffect activated on startup to create the "Item" elements -- one for every song/album/genre/etc.
    useEffect(() => {
        const performAsync = async () => {
            // Get the appropriate data source, based on the type of "all" page this is
            let data;
            console.log(accessToken, profile);

            // Get the email, offset, and limit
            const { email } = profile;
            const offset = 0;
            const limit = 50;

            // Retrieve data from the server depdning on type
            const json = await fetch(`/api/${type}/top?email=${email}&offset=${offset}&limit=${limit}`);
            const result = await json.json();

            if (result["error"]) {
                // Error check
                console.log(`Error loading ${type} data`);
                console.log(result["error"])
                return;
            }

            data = result["success"];
            console.log(data);
            setClickedItem(data[0].id);
            if (type === 'songs') {
                setItemType("track");
            } else if (type === 'albums') {
                setItemType("album");
            }

            // Loop over every object in the data source
            const info = [
                <ListGroup.Item>
                    <Item key={0} rank={0} type={type} />
                </ListGroup.Item>
            ];


            for (let index = 0; index < data.length; index++) {
                function onClickItem() {
                    console.log(data[index]);
                    if (type === 'songs') {
                        setClickedItem(data[index].id);
                    } else if (type === 'albums') {
                        setClickedItem(data[index].id);
                    }
                    setPlay(true);
                }

                // Create the Item element with the appropriate data
                info.push(
                    <ListGroup.Item>
                        <a style={{ cursor: "pointer" }} onClick={onClickItem} >
                            <Item
                                key={index + 1}
                                type={type}
                                {...data[index]}
                            />
                        </a>
                    </ListGroup.Item>
                );
            }
            setItems(info);
        }

        performAsync()
            .then()
            .catch((err) => {
                console.log(`There was an error loading ${type} elements:`)
                console.log(err)
            })
    }, []);

    useEffect(checkTokens, []);
    const style = {
        backgroundColor: "#373737",
        borderTop: "1px solid #E7E7E7",
        textAlign: "center",
        padding: "0px",
        position: "fixed",
        left: "0",
        bottom: "0",
        height: "70px",
        width: "100%"
    };

    function updatePlayState(state) {
        if (!state.isPlaying) {
            setPlay(false);
            setClickedItem(null);
        }
    }

    return (
        <div className="App">
            {/* Pane for the song/album/genre/etc list */}
            <PaneHolder>
                <ListGroup style={{ margin: "7.5%" }}>
                    {items || "Loading . . . "}
                </ListGroup>
            </PaneHolder>

            {/* Display the web player if the type is 'songs' or 'albums' */}
            {
                (type === 'songs' || type === 'albums') &&
                <div style={style}>
                    <SpotifyPlayer token={accessToken}
                        uris={[`spotify:${itemType}:${clickedItem}`]} callback={(state) => (updatePlayState(state))}
                        styles={{
                            activeColor: '#fff',
                            bgColor: '#333',
                            color: '#fff',
                            loaderColor: '#00B2FF',
                            sliderColor: '#00B2FF',
                            trackArtistColor: '#ccc',
                            trackNameColor: '#fff',
                            height: 70
                        }}
                        play={play}
                    />
                </div>
            }
        </div>
    );
};

export default All;