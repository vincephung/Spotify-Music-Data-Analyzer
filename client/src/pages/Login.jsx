import './css/Login.css';
import Button from 'react-bootstrap/Button';
import React from 'react';

const Login = () => {
    const clientPort = process.env.REACT_APP_PORT;
    // Ideally the button should link to the spotify API login page but we'll work on that later

    return (
        <div className="Login">
            <h1 className="title">Stat.ify</h1>
            <p className="about">Discover more about your listening habits at any time</p>
            <p>
                <Button
                    href={
                        window.localStorage.getItem('access_token') && window.localStorage.getItem('refresh_token')
                            ? `http://localhost:${clientPort}/dashboard`
                            : `http://localhost:${clientPort}/api/login`
                    }
                    className='button-54'
                    role="button"
                > Log in with Spotify </Button>
            </p>
        </div>
    );
}

export default Login;
