import React, { useState } from 'react';
import Square from './Square';

function Board() {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);

    const handleClick = (i) => {
        const newSquares = squares.slice();
        if (calculateWinner(newSquares) || newSquares[i]) {
            return;
        }
        newSquares[i] = isXNext ? 'X' : 'O';
        setSquares(newSquares);
        setIsXNext(!isXNext);
    };

    const renderSquare = (i) => {
        return <Square value={squares[i]} onClick={() => handleClick(i)} />;
    };

    const winner = calculateWinner(squares);
    const isDraw = !winner && squares.every(square => square !== null);
    const status = winner ? 'Winner: ' + winner : isDraw ? 'Draw' : 'Next player: ' + (isXNext ? 'X' : 'O');

    const resetGame = () => {
        setSquares(Array(9).fill(null));
        setIsXNext(true);
    };

    return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
            {(winner || isDraw) && <button onClick={resetGame}>Restart Game</button>}
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

export default Board;