import React from 'react';
import Board from './Board';
import { scorePosition, lastBestMove, clearCache, positionsChecked, checkBoard} from './Logic';
import Settings from './Settings';
import Stats from './Stats';

class Game extends React.Component {

    constructor(props) {
        super(props);

        let board = new Array(props.width*props.width);
        board.fill(0);

        this.state = {
            board: board,
            moves: 0,
            stats: false,
            aiRed: false,
            aiBlack: true,
            score: 0,
            lastBestMove: [],
            positionsChecked: 0,
            gameOver: false,
        }
    }

    boardClick = (idx, ai) => {
        if (this.state.gameOver) {
            return;
        }
        if (this.state.board[idx] !== 0) {
            return;
        }
        let turn = this.state.moves % 2 + 1;
        if (!ai && ((turn === 1 && this.state.aiRed) || (turn === 2 && this.state.aiBlack))) {
            return;
        }

        let newBoard = this.state.board.slice(0);
        newBoard[idx] = turn;
        this.setState({board: newBoard, moves: this.state.moves + 1}, () => {
            setTimeout(() => {
                this.doAIStats(newBoard, 3-turn);
            }, 0)
        });
    }

    doAIStats(board, turn) {
        console.log(board);
        let score = scorePosition(board, turn, true);
        console.log('Board', board);
        console.log('Turn', turn);
        console.log('Score', score);
        console.log('Best Move', lastBestMove);
        console.log('Positions Checked', positionsChecked());
        let curBoardOk = checkBoard(board);
        if (!curBoardOk || this.state.moves === 16) {
            this.setState({
                gameOver: true,
            })
        }
        this.setState({
            score: score,
            lastBestMove: lastBestMove,
            positionsChecked: positionsChecked(),
        });
        if (lastBestMove.length >= 0) {
            if ((turn === 2 && this.state.aiBlack) || (turn === 1 && this.state.aiRed)) {
                setTimeout(() => {
                    this.boardClick(lastBestMove[Math.floor(Math.random() * lastBestMove.length)], true);
                }, 100);
            }
        }
        clearCache();
    }

    aiMove() {
        this.doAIStats(this.state.board, this.state.moves % 2 + 1);
    }

    aiRedClick = (e) => {
        this.setState({
            aiRed: e.target.checked,
        });
        if (this.state.moves % 2 === 0) {
            setTimeout(() => {
                this.aiMove();
            }, 0);
        }
    }

    aiBlackClick = (e) => {
        this.setState({
            aiBlack: e.target.checked,
        });
        if (this.state.moves % 2 === 1) {
            setTimeout(() => {
                this.aiMove();
            }, 0);
        }
    }

    statsClick = (e) => {
        this.setState({
            stats: e.target.checked,
        });
    }

    reset = () => {
        let board = new Array(this.props.width*this.props.width);
        board.fill(0);
        this.setState({
            board: board,
            moves: 0,
            score: 0,
            lastBestMove: [],
            positionsChecked: 0,
            gameOver: false,
        }, () => {
            setTimeout(() => {
                if (this.state.aiRed) {
                    this.doAIStats(this.state.board, 1);
                }
            }, 200);
        });
    }

    render() {
        let winMessage = null;
        if (this.state.gameOver) {
            let msg = 'Tie!';
            if (this.state.score > 0) {
                msg = 'Red Wins!';
            }
            if (this.state.score < 0) {
                msg = 'Black Wins!';
            }
            winMessage = <div><h4>{msg}</h4><button onClick={this.reset}>Reset</button></div>
        }
        return <div>
                <Board width={this.props.width} board={this.state.board} click={this.boardClick}></Board>
                {winMessage}
                <Settings red={this.aiRedClick} black={this.aiBlackClick} stats={this.statsClick}></Settings>
                {this.state.stats ? <Stats score={this.state.score} bestMoves={this.state.lastBestMove} positionsChecked={this.state.positionsChecked}></Stats> : null}
            </div>
    }
}
export default Game;