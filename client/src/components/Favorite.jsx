import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, ListGroup, Image } from "react-bootstrap";
import './css/favorite.css'
import genreImg from '../pages/img/genre.jpg'

// Component for a user's favorite item (song, genre, album, artist)
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
                                    &nbsp;&nbsp;by {ranks[0].loading ? "[loading]" : ranks[0].creators.join(', ')} &nbsp;
                                </span>
                        }
                    </div>
                </div>
            </Card.Title>
            <ListGroup className="topListGroup" variant="flush" as="ul">
                {ranks.slice(1).map((rank,index)=>{
                    return <ListGroup.Item as="li">
                    <div style={{ textAlign: "Left" }}>
                        <span className="number"> {index+1}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {rank.loading ? "[loading]" : rank.mediaName.trim()}
                        {
                            type === 'Genres' || type === 'Artists' ? <></> :
                                <span style={{ color: "grey" }}>
                                    &nbsp;&nbsp; by {rank.loading ? "[loading]" : rank.creators.join(', ')}
                                </span>
                        }
                    </div>
                </ListGroup.Item>
                })}
            </ListGroup>
            <div style={{
                display: "flex",
                justifyContent: "right",
            }}>
                <Button className="viewAll"
                    variant="primary"
                    href={`/all/${type}`}
                >View All</Button>
            </div>
        </Card.Body>
    </Card>
}


export default Favorite;
