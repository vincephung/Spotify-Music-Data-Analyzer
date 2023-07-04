import React from 'react';
import "./css/Recommendation.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

const Recommendation = ({
    image,
    songName,
    artists,
    albumName,
    uri
}) => {

    // Function that changes the hash para of url
    const handleClick = () => {
        var refresh = window.location.origin + "/premium/recommendations/#" + uri;
        window.history.pushState({ path: refresh }, '', refresh);

        var popStateEvent = new PopStateEvent('popstate', { state: refresh });
        dispatchEvent(popStateEvent);
    }

    return (
        <Container className="recommendationContainer">
            <Card className="recommendationCard text-center" onClick={handleClick} style={{ cursor: "pointer" }}>
                <div className="albumImage">
                    <Image
                        thumbnail
                        src={image}
                        width="400px"
                        height="400px"
                    />
                </div>

                <Card.Text>
                    Song:&nbsp;&nbsp;
                    <span style={{ color: "grey" }}>{songName}</span>
                </Card.Text>
                <Card.Text>
                    Artist:&nbsp;&nbsp;
                    <span style={{ color: "grey" }}>{(artists === undefined) ? "[loading]" : artists.join(', ')}</span>
                </Card.Text>
                <Card.Text>
                    Album:&nbsp;&nbsp;
                    <span style={{ color: "grey" }}>{albumName}</span>
                </Card.Text>
                <Card.Footer>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default Recommendation;