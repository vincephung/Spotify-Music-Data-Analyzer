import "./css/Menu.css";
import { Outlet, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { useState, useEffect } from "react";
import { logOut, checkTokens } from '../manageTokens'
import defaultImage from '../pages/img/profile.png'

const Menu = () => {
    const [ profile, setProfile ] = useState(null);

    console.log("Hello")

    // use effect funtion on load to store user data into session storage
    useEffect(() => {

        // Get access token from local storage
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            // If not already in local storage, then put it there
            checkTokens();
            accessToken = localStorage.getItem('access_token');
        }

        // Set the access token to a default header for all axios requests
        const axios = require('axios')
        axios.defaults.headers['Authorization'] = `${accessToken}`;

        // Function to fetch and store session data
        const fetchUserData = async () => {
            console.log('fetching user data')
            try {
                // Fetch the data from the api with axios
                const { data } = await axios.get (
                    `http://localhost:${process.env.REACT_APP_PORT}/api/profile`
                );

                // Store the data in session storage and in the "profile" object
                window.sessionStorage.setItem("userProfile", JSON.stringify(data));
                setProfile(data);
            } 
            catch(e) {
                console.error(e);
            }
        };

        // Fetch the data
        fetchUserData();
    }, []);

    return (
        <div className= "parent">
            <Navbar fixed="top" expand="lg" className="navbar navbar-customclass">
                <Container>
                    {/* Stat.ify logo */}
                    <Link className="link" to="/dashboard"> 
                        <Navbar.Brand  href="/dashboard" style={{
                            color: '#00B2FF',
                            fontSize: '2.2em',
                            textAlign: "left",
                            textShadow :"-4px 3px 0 #000, -5px 7px 0 #0a0e27"
                        }}>
                            Stat.ify
                        </Navbar.Brand>
                    </Link>
    
    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    
                    {/* Main Nav bar */}
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link className="link" to="/dashboard"> 
                            <Nav.Link href="/dashboard">Dashboard</Nav.Link></Link>
                            
                            {/* Drop down for each "all" page */}
                            <NavDropdown  className="caret" title="All" id="basic-nav-dropdown">
    
                                <Link to= "/all/songs" className="link"> 
                                    <NavDropdown.Item 
                                        href="/all/songs"
                                        onClick={() => {
                                            if (window.location.href.includes('all')) {
                                                window.location.href="/all/songs"
                                            }
                                        }}
                                    > All Your Top Songs </NavDropdown.Item>
                                </Link>
                                <Link to= "/all/artists" className="link"> 
                                    <NavDropdown.Item 
                                        href="/all/artists"
                                        onClick={() => {
                                            if (window.location.href.includes('all')) {
                                                window.location.href="/all/artists"
                                            }
                                        }}
                                    > All Your Top Artists </NavDropdown.Item>
                                </Link>
                                <Link to= "/all/genres" className="link"> 
                                    <NavDropdown.Item 
                                        href="/all/genres"
                                        onClick={() => {
                                            if (window.location.href.includes('all')) {
                                                window.location.href="/all/genres"
                                            }
                                        }}
                                    > All Your Top Genres </NavDropdown.Item>
                                </Link>
                                <Link to= "/all/albums" className="link"> 
                                    <NavDropdown.Item 
                                        href="/all/albums"
                                        onClick={() => {
                                            if (window.location.href.includes('all')) {
                                                window.location.href="/all/albums"
                                            }
                                        }}
                                    > All Your Top Albums </NavDropdown.Item>
                                </Link>
                                <NavDropdown.Divider />
                            </NavDropdown>
                            
                            {/* Show blurry page if user is not premium and have button that says join premium */}
                            <Link to="/premium/recommendations" className="link"> 
                                <Nav.Link 
                                    href="/premium/recommendations"
                                    onClick={() => {
                                        if (window.location.href.includes('premium')) {
                                            window.location.href="/premium/recommendations"
                                        }
                                    }}
                                > Recommendations </Nav.Link>
                            </Link>
                            <Link to="/premium/sharing" className="link"> 
                                <Nav.Link 
                                    href="/premium/sharing"
                                    onClick={() => {
                                        if (window.location.href.includes('premium')) {
                                            window.location.href="/premium/sharing"
                                        }
                                    }}
                                > Share with Friends </Nav.Link>
                            </Link>
                        </Nav>
                        
                        {/* Dropdown for user options */}
                        <Nav>
                            {profile && (
                                <NavDropdown 
                                    title={
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between"
                                        }}>
                                            <div style={{marginRight: "10px"}}>
                                                Hi, {profile.display_name}
                                            </div>
                                            <div className="avatarContainer">
                                                <img className="thumbnail-image" 
                                                    src={
                                                        profile.profile_img || defaultImage
                                                    } 
                                                    alt="user pic"
                                                />
                                            </div>
                                        </div>
                                    } 
                                    id="userDropdown"
                                >
                                    <Link to="/profile" className="link"> 
                                        <NavDropdown.Item href="/profile"> Profile</NavDropdown.Item>
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/" className="link"> 
                                        <NavDropdown.Item onClick={logOut}> Log Out</NavDropdown.Item>
                                    </Link>
                                
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        <Outlet />     
        </div> 
    );
};

export default Menu;
