import React, { useState } from 'react';
import Board from './Board';

function Game() {
    const [isPlayerFirst, setIsPlayerFirst] = useState(true);
    const [level, setLevel] = useState('low');
    const [gameStarted, setGameStarted] = useState(false);

    const startGame = (isPlayerFirst, level) => {
        setIsPlayerFirst(isPlayerFirst);
        setLevel(level);
        setGameStarted(true);
    };

    if (!gameStarted) {
        return (
            <div className="game">
                <h1>三目並べ</h1>
                <div>
                    <button className="button buttonPrimary" onClick={() => startGame(true, level)}>プレイヤー先行</button>
                    <button className="button buttonSecondary" onClick={() => startGame(false, level)}>コンピューター先行</button>
                </div>
                <div>
                    <label>
                        レベル:
                        <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board isPlayerFirst={isPlayerFirst} level={level} />
            </div>
        </div>
    );
}
export default Game;