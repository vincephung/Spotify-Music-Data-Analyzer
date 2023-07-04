

const logOut = () => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.location.href = "/"
}

const checkTokens = () => {

    if (window.location.href.includes('/dashboard/') && window.location.hash.split('#')[1]) {

        // If the current page is the dashboard, try to parse the tokens out from the 
        //      url and store them in local storage
        let queryString = new URLSearchParams(window.location.hash.split('#')[1]);

        // Spotify fields
        localStorage.setItem('access_token', queryString.get('access_token'))
        localStorage.setItem('refresh_token', queryString.get('refresh_token'))
        localStorage.setItem('access_token_expires_in', parseInt(queryString.get('access_token_expires_in')))
        localStorage.setItem('access_token_created', Date.now())

        // User data
        localStorage.setItem('userEmail', queryString.get('email'));

        // Clear all the query parameters from the url
        window.history.replaceState({}, "", "/dashboard/")
        window.location.reload();
    }

    // Check if the tokens are in local storage
    const accessToken  = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && refreshToken) {
        // Retrieved the tokens
        
        // Now, verify that these tokens are still valid
        // Check that the time limit to use the access token has not elapsed
        const now = Date.now()    // current unix timestamp
        const created = localStorage.getItem('access_token_created')         // time the access token was created 
        const timeLimit = localStorage.getItem('access_token_expires_in');   // time limit of the access token

        if (now - created >= timeLimit) {

            // The token has decayed
            console.warn('Access token has decayed.  Refresshing token . . . ')

            // Error function
            const err = err => {
                alert("There was an error authenticating you.  Please log in again.")
                logOut();
            }

            fetch(`/api/refresh_token?refresh_token=${localStorage.getItem('refresh_token')}`)
            .then(json => {
                json.json()
                .then(res => {
                    if (res.success) {
                        const success = res.success;

                        // On success, store the access token and time information in local storage
                        localStorage.setItem('access_token', success.access_token)
                        localStorage.setItem('access_token_created', Date.now())
                        localStorage.setItem('access_token_expires_in', success.access_token_expires_in)

                        // Report the success :)
                        console.log('Token refreshed :)')
                    }
                    else { err() }
                })
                .catch(err)
            })
            .catch(err)
        }
        else {
            // Token has not decayed
            // Just report the success to the console
            console.log('Tokens loaded :)')
        }
    }
    else {
        // If there was some failure in initializing the access and refresh tokens, then clear
        //      tokens from local storage and navigate back to the login page

        // clear tokens
        window.localStorage.clear()

        // navigate back to the login page
        window.location.href = '/'
    }
}

module.exports = {
    logOut,
    checkTokens
}