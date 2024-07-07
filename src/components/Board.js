import React, { useState, useEffect, useCallback } from 'react';
import Square from './Square';
import { Link } from 'react-router-dom';

const MAX_DEPTH = 6;

function Board({ isPlayerFirst, level, onGameEnd }) {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(isPlayerFirst);
    const [isComputerThinking, setIsComputerThinking] = useState(false);

    const getRandomMove = useCallback((board) => {
        const availableMoves = board.map((square, index) => square === null ? index : null).filter(index => index !== null);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }, []);

    const calculateWinner = useCallback((squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }, []);

    const isBoardFull = useCallback((squares) => {
        return squares.every(square => square !== null);
    }, []);

    const evaluateBoard = useCallback((board, player) => {
        const opponent = player === 'X' ? 'O' : 'X';
        let score = 0;
        
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (let line of lines) {
            const playerCount = line.filter(i => board[i] === player).length;
            const opponentCount = line.filter(i => board[i] === opponent).length;
            const emptyCount = line.filter(i => board[i] === null).length;
            
            if (playerCount === 3) score += 100;
            else if (playerCount === 2 && emptyCount === 1) score += 10;
            else if (playerCount === 1 && emptyCount === 2) score += 1;
            
            if (opponentCount === 2 && emptyCount === 1) score -= 50;
        }
        
        return score;
    }, []);

    const minimax = useCallback((board, depth, isMaximizing, player) => {
        const opponent = player === 'X' ? 'O' : 'X';
        
        if (depth >= MAX_DEPTH) {
            return evaluateBoard(board, player);
        }
        
        const winner = calculateWinner(board);
        if (winner) {
            return winner === player ? 10 - depth : depth - 10;
        }
        
        if (isBoardFull(board)) {
            return 0;
        }
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = player;
                    const score = minimax(board, depth + 1, false, player);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = opponent;
                    const score = minimax(board, depth + 1, true, player);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }, [calculateWinner, evaluateBoard, isBoardFull]);

    const getBestMove = useCallback((board, player) => {
        let bestScore = player === 'O' ? -Infinity : Infinity;
        let move;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = player;
                const score = minimax(board, 0, false, player);
                board[i] = null;
                if (player === 'O' ? score > bestScore : score < bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }, [minimax]);

    const getMediumMove = useCallback((board) => {
        // 勝利可能な手を探す
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                if (calculateWinner(board) === 'O') {
                    board[i] = null;
                    return i;
                }
                board[i] = null;
            }
        }
        // 相手の勝利を阻止する手を探す
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                if (calculateWinner(board) === 'X') {
                    board[i] = null;
                    return i;
                }
                board[i] = null;
            }
        }
        // それ以外はランダムな手を選ぶ
        return getRandomMove(board);
    }, [calculateWinner, getRandomMove]);

    const makeComputerMove = useCallback(() => {
        const newSquares = squares.slice();
        let move;
        if (level === 'low') {
            move = getRandomMove(newSquares);
        } else if (level === 'medium') {
            move = getMediumMove(newSquares);
        } else {
            move = getBestMove(newSquares, 'O');
        }
        if (move !== null) {
            newSquares[move] = 'O';
            setSquares(newSquares);
            setIsXNext(true);
        }
    }, [squares, level, getRandomMove, getMediumMove, getBestMove]);

    useEffect(() => {
        if (!isXNext && !calculateWinner(squares) && !isBoardFull(squares)) {
            setIsComputerThinking(true);
            const timer = setTimeout(() => {
                makeComputerMove();
                setIsComputerThinking(false);
                setIsXNext(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isXNext, squares, makeComputerMove, calculateWinner, isBoardFull]);

    const handleClick = (i) => {
        if (isComputerThinking || calculateWinner(squares) || squares[i] || !isXNext) {
            return;
        }
        const newSquares = squares.slice();
        newSquares[i] = 'X';
        setSquares(newSquares);
        setIsXNext(false);
    };

    const renderSquare = (i) => {
        return <Square value={squares[i]} onClick={() => handleClick(i)} disabled={isComputerThinking} />;
    };

    const winner = calculateWinner(squares);
    const isDraw = !winner && isBoardFull(squares);
    const status = winner ? '勝者: ' + winner : isDraw ? '引き分け' : '次のプレイヤー: ' + (isXNext ? 'X' : 'O');

    const resetGame = () => {
        setSquares(Array(9).fill(null));
        setIsXNext(isPlayerFirst);
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
            {(winner || isDraw) && (
                <div>
                    <button className="button buttonPrimary" onClick={resetGame}>ゲームを再開</button>
                    <button className="button buttonSecondary" onClick={onGameEnd}>トップページに戻る</button>
                </div>
            )}
            {isComputerThinking && <div>コンピューターが考え中...</div>}
        </div>
    );
}

export default Board;
