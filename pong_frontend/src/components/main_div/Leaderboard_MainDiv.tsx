import React, { useEffect, useState } from 'react';
import { IUser } from '../../interfaces/interface';
import { getLeaderboard } from '../../api/leaderboard.api';
import {main_div_mode_t} from '../MainDivSelector';
interface LeaderboardProps
{
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const Leaderboard_MainDiv: React.FC<LeaderboardProps>  = ({mode_set, friend_set}) => {
  const [leaderboard, setLeaderboard] = useState<IUser[]>([]);
  const [scoreMap, setScoreMap] = useState<Map<number, number>>(new Map());

  const getData = async () => {
    const leaderboardData = await getLeaderboard();
    setLeaderboard(leaderboardData);
  };

  useEffect(() => {
    getData();
  }, []);

  const openFriend = (FID:number) => {
    friend_set(FID);
    mode_set(main_div_mode_t.PUBLIC_PROFILE);
  };

  useEffect(() => {
    if (leaderboard.length === 0) return;

    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.points - a.points);

    // Calculate spot for each user
    const scoreMap = new Map<number, number>();
    let spot = 1;
    let prevScore = sortedLeaderboard[0].points;
    for (let i = 0; i < sortedLeaderboard.length; i++) {
      const user = sortedLeaderboard[i];
      if (user.points < prevScore) {
        spot = i + 1;
        prevScore = user.points;
      }
      scoreMap.set(user.points, spot);
    }
    setScoreMap(scoreMap);
  }, [leaderboard]);

  return (
    <div>
      <h1>Leaderboard:</h1>
      <ul>
        {leaderboard.map((user, index) => (
          <li key={user.username}>
            <div>
              <h2>Place: {scoreMap.get(user.points)}</h2>
              <p onClick={() => openFriend(user.userID)}>Name: {user.username}</p>
              <p>Wins: {user.wins}</p>
              <p>Losses: {user.losses}</p>
              <p>Points: {user.points}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard_MainDiv;
