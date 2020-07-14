import React from 'react';

function Piece(props) {
    
    return <div style={{width: 50, height: 50, border: '2px solid black', cursor: 'pointer'}} onClick={() => props.click()}><div style={{
        height: '25px',
        width: '25px',
        margin: '12px',
        backgroundColor: props.state === 0 ? '#fff' : props.state === 1 ? '#f33' : '#333',
        borderRadius: '50%',
        display: 'inline-block',
      }}></div></div>
}

export default Piece;