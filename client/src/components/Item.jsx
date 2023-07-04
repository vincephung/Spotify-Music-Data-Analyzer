import React from 'react';
import "./css/item.css";

// Component for the header row
const HeaderRow = ({ type }) => {
    type = type.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    return (
        <>
            <div style={{
                fontSize: "20px",
                fontWeight: "bolder"
            }}>
                {type}
            </div>
        </>
    )
}

const Item = ({
    type,
    rank,
    mediaName,
    creators,
}) => {
    return (
        <div className="allContainer">
            {
                rank === 0 ? <HeaderRow type={type} /> :
                    <>
                        <div className="all">
                            <span className="number">
                                {rank.trim()}
                            </span>
                            &nbsp;&nbsp;{mediaName.trim()}
                            {
                                type === 'genres' || type === 'artists' ? <></> :
                                    <span style={{ color: "grey" }}>
                                        &nbsp;&nbsp;by {creators.join(', ')}
                                    </span>
                            }
                        </div>
                    </>
            }
        </div>
    )
}

export default Item;
