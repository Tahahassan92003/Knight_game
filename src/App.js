import React, { useEffect, useState } from 'react';
import './App.css';
import knightImg from './assets/knight.png';
import dangerImg from './assets/danger.png';
import collectableImg from './assets/collectable.png';
import { db } from './firebase';
import Leaderboard from './components/Leaderboard';

const BOARD_SIZE = 20;

const App = () => {
  const [board, setBoard] = useState([]);
  const [playerPosition, setPlayerPosition] = useState([0, 0]);
  const [items, setItems] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    initBoard();
    setStartTime(Date.now());
  }, []);

  const initBoard = () => {
    let initialBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
    const newItems = spawnElements('item', 10);
    const newEnemies = spawnElements('enemy', 5);
    setItems(newItems);
    setEnemies(newEnemies);

    newItems.forEach(([x, y]) => (initialBoard[x][y] = 'item'));
    newEnemies.forEach(([x, y]) => (initialBoard[x][y] = 'enemy'));

    setBoard(initialBoard);
  };

  const spawnElements = (type, count) => {
    let elements = [];
    while (elements.length < count) {
      let x = Math.floor(Math.random() * BOARD_SIZE);
      let y = Math.floor(Math.random() * BOARD_SIZE);
      if ((x !== 0 || y !== 0) && !elements.some(([ex, ey]) => ex === x && ey === y)) {
        elements.push([x, y]);
      }
    }
    return elements;
  };

  const handleKeyDown = (e) => {
    let [x, y] = playerPosition;
    switch (e.key) {
      case 'ArrowUp':
        if (x > 0) x--;
        break;
      case 'ArrowDown':
        if (x < BOARD_SIZE - 1) x++;
        break;
      case 'ArrowLeft':
        if (y > 0) y--;
        break;
      case 'ArrowRight':
        if (y < BOARD_SIZE - 1) y++;
        break;
      default:
        return;
    }
    movePlayer([x, y]);
  };

  const movePlayer = (newPosition) => {
    const [x, y] = newPosition;
    if (board[x][y] === 'enemy') {
      alert('Game Over! You hit an enemy.');
      initBoard();
      setPlayerPosition([0, 0]);
      return;
    }
    if (board[x][y] === 'item') {
      const remainingItems = items.filter(item => item[0] !== x || item[1] !== y);
      setItems(remainingItems);
      if (remainingItems.length === 0) {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000;
        alert(`Congratulations! You collected all items in ${timeTaken} seconds.`);
        saveScore(timeTaken);
        initBoard();
        setPlayerPosition([0, 0]);
        return;
      }
    }
    setPlayerPosition(newPosition);
  };

  const saveScore = async (timeTaken) => {
    try {
      await db.collection('scores').add({ time: timeTaken, date: new Date() });
    } catch (error) {
      console.error('Error saving score: ', error);
    }
  };

  return (
    <div className="game-container" tabIndex="0" onKeyDown={handleKeyDown}>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="cell">
                {playerPosition[0] === rowIndex && playerPosition[1] === cellIndex && (
                  <img src={knightImg} alt="Knight" className="knight" />
                )}
                {cell === 'enemy' && <img src={dangerImg} alt="Enemy" className="danger" />}
                {cell === 'item' && <img src={collectableImg} alt="Collectable" className="collectable" />}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Leaderboard />
    </div>
  );
};

export default App;
