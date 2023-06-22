import React, { useEffect, useState } from 'react';
import { ILeaderboard } from '../../interfaces/leaderboard_user.interface';
import { getLeaderboard } from '../../api/leaderboard.api';

const Leaderboard_MainDiv = () => {
  const [leaderboard, setLeaderboard] = useState<ILeaderboard[]>([]);
  const [spot, setSpot] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const getData = async () => {
    const leaderboard_temp = await getLeaderboard();
    setLeaderboard(leaderboard_temp);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (leaderboard.length === 0) return;

    // Find the spot based on score
    const spot = leaderboard.findIndex(user => user.points === score) + 1;
    setSpot(spot);

    // Update the score state
    setScore(leaderboard[0].points);
  }, [leaderboard]);

  return (
    <div>
      <h1>Leaderboard:</h1>
      <ol>
        {leaderboard.map((user, index) => (
          <li key={user.userId}>
            <div>
              <h2>{spot}</h2>
              <p>Name: {user.nickname}</p>
              <p>Wins: {user.wins}</p>
              <p>Losses: {user.losses}</p>
              <p>Points: {user.points}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard_MainDiv;