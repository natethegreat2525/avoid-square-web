import React from 'react';

function Stats(props) {
    let winningMessage = 'Game is a draw';
    if (props.score > 0) {
      winningMessage = 'Red can win';
    }
    if (props.score < 0) {
      winningMessage = 'Black can win';
    }
    return <div>
      <div>{winningMessage}</div>
      <div>Positions Checked: {props.positionsChecked}</div>
      <div>Best Moves (index): {props.bestMoves.join(', ')}</div>
    </div>
}

export default Stats;