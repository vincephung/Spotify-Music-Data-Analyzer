import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, ListGroup, Image } from "react-bootstrap";
import './css/favorite.css'
import genreImg from '../pages/img/genre.jpg'

const Favorite = ({
    type,
    ranks
}) => {
    return <Card className="topCard" >
        <Card.Header className="topCardHeader">
            <div className="albumImgContainer">
                <Image className="albumImg"
                    thumbnail
                    src={(() => {
                        if (type === 'Genres') {
                            return genreImg
                        }
                        return ranks[0].image
                    })()}
                ></Image>
            </div>
            Top {type}
        </Card.Header>
        <Card.Body className="topCardBody">
            <Card.Title>
                <div className="topItem">
                    <div className="number-one">1 </div>
                    <div className="number-one-item">
                        {ranks[0].loading ? "[loading]" : ranks[0].mediaName} {
                            type === 'Genres' || type === 'Artists' ? <></> :
                                <span style={{ color: "grey" }}>
                                    &nbsp;&nbsp;by {ranks[0].loading ? "[loading]" : ranks[0].creators} &nbsp;
                                </span>
                        }
                    </div>
                </div>
            </Card.Title>
            <ListGroup className="topListGroup" variant="flush" as="ul">
                <ListGroup.Item as="li">
                    <div style={{ textAlign: "Left" }}>
                        <span className="number"> 2</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {ranks[1].loading ? "[loading]" : ranks[1].mediaName.trim()}
                        {
                            type === 'Genres' || type === 'Artists' ? <></> :
                                <span style={{ color: "grey" }}>
                                    &nbsp;&nbsp; by {ranks[1].loading ? "[loading]" : ranks[1].creators}
                                </span>
                        }
                    </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                    <div style={{ textAlign: "Left" }}>
                        <span className="number">3</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {ranks[2].loading ? "[loading]" : ranks[2].mediaName.trim()}
                        {
                            type === 'Genres' || type === 'Artists' ? <></> :
                                <span style={{ color: "grey" }}>
                                    &nbsp;&nbsp;by {ranks[2].loading ? "[loading]" : ranks[2].creators}
                                </span>
                        }
                    </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                    <div style={{ textAlign: "Left" }}>
                        <span className="number">4</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {ranks[3].loading ? "[loading]" : ranks[3].mediaName.trim()}
                        {
                            type === 'Genres' || type === 'Artists' ? <></> :
                                <span style={{ color: "grey" }}>
                                    &nbsp;&nbsp;by {ranks[3].loading ? "[loading]" : ranks[3].creators}
                                </span>
                        }
                    </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                    <div style={{ textAlign: "Left" }}>
                        <span className="number">5</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {ranks[4].loading ? "[loading]" : ranks[4].mediaName.trim()}
                        {
                            type === 'Genres' || type === 'Artists' ? <></> :
                                <span style={{ color: "grey" }}>
                                    &nbsp;&nbsp; by {ranks[4].loading ? "[loading]" : ranks[4].creators}
                                </span>
                        }
                    </div>
                </ListGroup.Item>
            </ListGroup>

            <div style={{
                display: "flex",
                justifyContent: "right",
            }}>
            </div>
        </Card.Body>
    </Card>
}


export default Favorite;
