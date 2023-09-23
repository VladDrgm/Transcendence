import React, { useEffect, useState } from 'react';
import * as styles from './LeaderboardPageStyles';
import { IUser } from '../../interfaces/interface';
import { getLeaderboard } from '../../api/leaderboard.api';
import { Link } from 'react-router-dom';

interface LeaderboardProps {
	friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const LeaderboardPage: React.FC<LeaderboardProps> = ({friend_set}) => {
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
		console.log("TUK: " + FID);
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
    	<div style={styles.pageStyle}>
      		<h1>Leaderboard:</h1>
      		<ul>
				{leaderboard.map((user, index) => (
					<li key={index}>
						<div>
							<h2>Place: {scoreMap.get(user.points)}</h2>
							<Link onClick={() => openFriend(user.userID)} key={index} to={"/app/public_profile"}>Name: {user.username}</Link>
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

export default LeaderboardPage;
