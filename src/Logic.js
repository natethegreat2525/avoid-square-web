function boardToString(board) {
    let l = Math.sqrt(board.length);
    let s = '';
    for (let i = 0; i < l; i++) {
        for (let j = 0; j < l; j++) {
            s += board[i + j*l];
        }
        s += '\n';
    }
    return s;
}


function boardToEnc(board) {
    let s = [];
    let curAc = 0;
    let Acc = 0;
    for (let i = 0; i < board.length; i++) {
        if (Acc === 4) {
            Acc = 0;
            s.push(String.fromCharCode(curAc));
            curAc = 0;
        }
        curAc = curAc | (board[i] << (2*Acc));
        Acc++;
    }
    if (Acc > 0) {
        s.push(String.fromCharCode(curAc));
    }
    return s.join('');
}

export function checkBoard(board) {
    let length = Math.sqrt(board.length);
    for (let i = 0; i < length-1; i++) {
        for (let j = 0; j < length-1; j++) {
            for (let x = 1; x < length-i; x++) {
                for (let y = 0; y < length-j; y++) {
                    let type = board[i + j*length];
                    if (type === 0) {
                        continue;
                    }
                    let found = false;
                    let xx = x, yy = y, ii = i + x, jj = j + y;
                    for (let n = 0; n < 3; n++) {
                        if (ii < 0 || jj < 0 || ii >= length || jj >= length) {
                            found = true;
                            break;
                        }
                        if (board[ii + jj*length] !== type) {
                            found = true;
                            break;
                        }
                        let tmp = xx;
                        xx = -yy;
                        yy = tmp;
                        ii += xx;
                        jj += yy;
                    }
                    if (!found) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function hash(board) {
    let c12x = 0;
    let c12y = 0;
    let length = Math.sqrt(board.length);
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (board[i + j*length] === 1) {
                c12x += i + .5 - length/2;
                c12y += j + .5 - length/2;
            }
            if (board[i + j*length] === 2) {
                c12x += (i + .5 - length/2)* .9;
                c12y += (j + .5 - length/2) * .9;
            }
        }
    }
    let flip = Math.abs(c12x) > Math.abs(c12y);
    let newBoard = new Array(board.length);
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            let x = i;
            let y = j;
            if (c12x < 0) {
                x = length - 1 - x;
            }
            if (c12y < 0) {
                y = length - 1 - y;
            }
            let a = i;
            let b = j;
            if (flip) {
                let t = a;
                a = b;
                b = t;
            }
            newBoard[a + b*length] = board[x + y*length];
        }
    }
    return boardToString(newBoard);
}

let checked = new Map();

export let lastBestMove = [];
export function clearCache() {
    checked = new Map();
}

export function positionsChecked() {
    return checked.size;
}

export function scorePosition(board, turn, orig) {
    if (orig) {
        lastBestMove = [];
    }
    let bh = hash(board);
    if (checked.has(bh)) {
        return checked.get(bh);
    }
    let nextTurn = 3 - turn;
    let curCheck = checkBoard(board);

    if (!curCheck) {
        let v = turn === 1 ? 1 : -1;
        checked.set(bh, v);
        return v;
    }

    let bestScore = -9;
    let worstScore = 9;
    let bestScoreMove = [];
    let worstScoreMove = [];

    let moves = 0;
    
    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) {
            if (orig) {
                console.log(i);
            }
            moves++;
            //possible move;
            let newBoard = board.slice(0);
            newBoard[i] = turn;
            let sc = scorePosition(newBoard, nextTurn);
            if (sc === bestScore) {
                bestScoreMove.push(i);
            }
            if (sc === worstScore) {
                worstScoreMove.push(i);
            }
            if (sc > bestScore) {
                bestScore = sc;
                bestScoreMove = [i];
            }
            if (sc < worstScore) {
                worstScore = sc;
                worstScoreMove =  [i];
            }
            if (turn === 1 && bestScore > 0) {
                break;
            }
            if (turn !== 1 && worstScore < 0) {
                break;
            }
        }
    }
    if (orig) {
        if (turn === 1) {
            lastBestMove = bestScoreMove;
        } else {
            lastBestMove = worstScoreMove;
        }
    }

    if (moves === 0) {
        checked.set(bh, 0);
        return 0;
    }

    let score = turn === 1 ? bestScore : worstScore;
    checked.set(bh, score);
    if (checked.size > 15000000) {
        console.log('clear')
        checked = new Map();
    }
    return score;
}
