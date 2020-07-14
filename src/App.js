import React from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Game';

function App() {
  return (
    <div className="App">
      <h2>Avoid Square 4x4</h2>
      Click any square to place a piece.
      <Game width={4}></Game>
    </div>
  );
}

export default App;
