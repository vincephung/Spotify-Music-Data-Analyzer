let User = require('../models/User');
const { generateRandomString } = require('../controllers/spotifyController');;

// Create generated link for a user
const setGeneratedLink = (req, res) => {
    // Ensure that the userEmail param in the url
    const userEmail = req.params.userEmail;
    if (!userEmail) {
        res.statusMessage = "Must include email in generateShareLink call"
        res.status(400)
        return;
    }

    // Create the share link with a random string of size 16
    const generatedLink = generateRandomString(16);

    // Update the user object with the new share link
    User.updateOne(
        { email: userEmail },                       // Find the user by email
        { generatedShareLink: generatedLink }       // Update their generatedShareLink field to the one generated above
    )
        .then(() => {
            // On success, return the share link
            res.json({
                "success": generatedLink
            })
        })
        // Report errors
        .catch((err) => {
            console.log("Error updating ${}'s share link:")
            console.log(err)
            throw err;
        });
}

module.exports = {
    setGeneratedLink
}