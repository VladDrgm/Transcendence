import React, { useEffect, useState } from 'react';
import * as styles from './LeaderboardPageStyles';
import { getLeaderboard } from '../../api/leaderboard.api';
import LeaderboardUser from './LeaderboardUser';
import { User } from '../../interfaces/User';
import { postUserStatus } from '../../api/statusUpdateAPI.api';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface LeaderboardProps {
	friend_set: React.Dispatch<React.SetStateAction<number>>;
	loggedInUsername: string | undefined;
}

const LeaderboardPage: React.FC<LeaderboardProps> = ({friend_set, loggedInUsername}) => {
	const [leaderboard, setLeaderboard] = useState<User[]>([]);
	const [scoreMap, setScoreMap] = useState<Map<number, number>>(new Map());
	const { user } = useUserContext();
	const navigate = useNavigate();

	const getData = async () => {
		const leaderboardData = await getLeaderboard();
    	setLeaderboard(leaderboardData);
  	};

  	useEffect(() => {
		// Check if the user is logged in when the component mounts
		if (!user) {
			navigate('/login'); // Redirect to the login page if not logged in
		}
    	getData();
		postUserStatus("Online", user!);
  	}, [navigate]);

  	const openFriend = (FID:number) => {
    	friend_set(FID);
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
		  <h1>Leaderboard</h1>
		  <table style={styles.tableStyle}>
			<colgroup>
				<col style={{ width: '25%' }} />
				<col style={{ width: '15%' }} /> 
				<col style={{ width: '15%' }} /> 
				<col style={{ width: '15%' }} />
				<col style={{ width: '15%' }} /> 
			</colgroup>
			<thead>
			  <tr style={styles.firstRowStyle}>
				<th>#Rank</th>
				<th style={styles.userContainer}>User</th>
				<th>Wins</th>
				<th>Losses</th>
				<th>Points</th>
			  </tr>
			</thead>
			<tbody>
				{leaderboard.map((user, index) => (
					 <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
					<td style={styles.tableCell}>{scoreMap.get(user.points)}</td>
					<LeaderboardUser
						user={user}
						index={index}
						loggedInUser={loggedInUsername}
						openFriend={openFriend}
					/>
					<td style={styles.tableCell}>{user.wins}</td>
					<td style={styles.tableCell}>{user.losses}</td>
					<td style={styles.tableCell}>{user.points}</td>
					</tr>
				))}
			</tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
