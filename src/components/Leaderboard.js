import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const scoresQuery = query(collection(db, 'scores'), orderBy('time'), limit(10));
      const scoresCollection = await getDocs(scoresQuery);
      setScores(scoresCollection.docs.map(doc => doc.data()));
    };
    fetchScores();
  }, []);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>{score.time} seconds</li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
