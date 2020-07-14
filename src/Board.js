import React from 'react';
import Piece from './Piece';

function Board(props) {
    let rows = [];
    let idx = 0;
    const genClick = (idx) => {
        return () => props.click(idx);
    }
    for (let i = 0; i < props.width; i++) {
        let row = [];
        for (let j = 0; j < props.width; j++) {
            row.push(<div key={j} style={{display: 'inline-block'}}><Piece state={props.board[idx]} click={genClick(idx)}></Piece></div>);
            idx++;
        }
        rows.push(<div key={i} style={{height: '54px'}}>{row}</div>)
    }
    return <div style={{padding: '10px'}}>{rows}</div>
}

export default Board;