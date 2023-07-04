import './css/UserPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Image, Stack, Link } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import { checkTokens, logOut } from '../manageTokens'
import { useEffect, useState } from 'react';
import defaultImage from './img/profile.png'

const UserPage = () => {
    useEffect(checkTokens, [])

    const [ profile, setProfile ] = useState(() => {
        return JSON.parse(
            window.sessionStorage.getItem('userProfile')
        )
    });
    const [ premium, setPremium ] = useState(profile.isPremium);

    // For display on profile
    let premiumStatus = "Standard";
    if (premium){
        premiumStatus = "Premium";
    }
    let shareLink = "";
    if (profile) {
        shareLink = `${window.location.origin}/premium/sharing/${profile.generatedShareLink}`;
    }

    return (
        <>{
            profile && (
                <Card className="profileCard text-center">
                    <div className="profilePictureDiv">
                        <Image className="profilePicture" roundedCircle thumbnail src={
                            profile.profile_img || defaultImage
                        }></Image>
                    </div>
                    <div className="profileText">
                        <Card.Title>{profile.display_name}</Card.Title>
                        <Card.Text></Card.Text>
                        <Card.Text>Username: {profile.id}</Card.Text>
                        <Card.Text>Email: {profile.email}</Card.Text> 
                        <Card.Text>Location: {profile.country}</Card.Text>
                        <Card.Text>Plan: {premiumStatus}</Card.Text>
                        { profile.generatedShareLink && premium && <Card.Text>
                            Share Link: <a href={shareLink} className="text-decoration-none">
                                {shareLink}
                            </a>
                        </Card.Text> }
                    </div>
                    <Card.Footer style={{padding: '10px'}}>
                        <Stack direction="horizontal" className="justify-content-md-center" gap={3}>
                            <Button 
                                className="profileBtns" variant ="success" 
                                onClick={() => {
                                    fetch(`/api/togglePremium?email=${profile.email}`)
                                    .then(result => {
                                        result.json(result).then(result => {
                                            if (result["error"]) {
                                                // Report error
                                                console.log("Error toggling premium:")
                                                console.log(result["error"])
                                                return;
                                            }

                                            console.log(`Successfully toggled premium status (${result['success']})`);

                                            // Update the profile object
                                            profile.isPremium = result["success"];
                                            window.sessionStorage.setItem("userProfile", JSON.stringify(profile));
                                        
                                            setPremium(profile.isPremium)
                                        });
                                    });
                                }
                            }> 
                                { premium ? 'Quit' : 'Join'} Premium 
                            </Button>
                            <Button 
                                className="profileBtns" variant ="danger" 
                                onClick={() => {

                                    const access_token = localStorage.getItem('access_token');

                                    fetch(`/api/refresh?email=${profile.email}&access_token=${access_token}`)
                                    .then(result => {
                                        result.json(result).then(result => {
                                            if (result["error"]) {
                                                // Report error
                                                console.log("Error refreshing data:")
                                                console.log(result["error"])
                                                return;
                                            }

                                            // Log the success
                                            console.log(`Successfully refreshed data!`);
                                        });
                                    });
                                }
                            }> Refresh Data</Button>
                            <Button 
                                className="profileBtns" 
                                variant ="danger" 
                                disabled={!premium}
                                onClick={() => {
                                    // Fetch to the generate share link endpoint
                                    fetch(`/api/user/generateShareLink/${profile.email}`)
                                    .then((result) => {
                                        // Convert the returned result to JSON
                                        result.json().then((result) => {

                                            // Report the error, if it exists
                                            if (result["error"]) {
                                                console.log(`There was an error generating share link`)
                                                console.log(result["error"])
                                                return;
                                            }

                                            // Otherwise, continue
                                            console.log(`Successfully retrieved share link: ${result["success"]}`)
                                            
                                            // Create a new profile object with all the old fields, and add the generatedShareLink 
                                            //      field as well
                                            const newProfile = { 
                                                ...profile, 
                                                generatedShareLink: result["success"]
                                            }

                                            // Write the link to the clipboard, and report this with a toast
                                            navigator.clipboard.writeText(`${window.location.origin}/premium/sharing/${result["success"]}`)
                                            toast.success("Copied share link to clipboard")

                                            // Add the profile to session storage, and update the profile state 
                                            sessionStorage.setItem("userProfile", JSON.stringify(newProfile))
                                            setProfile(newProfile)

                                        })
                                        .catch((err) => {
                                            console.log(`There was an error generating share link`)
                                            console.log(err)
                                        })
                                    })
                                    .catch((err) => {
                                        console.log(`There was an error generating share link`)
                                        console.log(err)
                                    })


                                }}>Generate Share Link</Button>
                            <Button className="profileBtns" variant ="danger" onClick={logOut}>Log out</Button>
                        </Stack>
                    </Card.Footer>
                </Card> 
            )}
            <div><Toaster
                position="top-center"
                reverseOrder={false}
            /></div>
        </>
        
    );
}

export default UserPage