import React, { useEffect, useState, ChangeEvent  } from 'react';
import * as styles from './private_divStyles';
import { PrivateProfile } from '../../interfaces/private_profile.interface';
import { getPrivateProfile } from '../../api/profile.api';
import { useUserContext } from '../context/UserContext';
import imageAssetAchievement1 from '../assets/achievement1.png'
import { fetchAddress } from './channel_div';

interface PrivateDivProps
{
  userID: number | undefined;
}

const Private_Div: React.FC<PrivateDivProps> = ({userID}) => {
	const { user, setUser } = useUserContext();

  	const getData = async () => {
    	try {
      		const myProf = await getPrivateProfile(userID);
      		setUser(myProf);
    	} catch (error) {
      		console.error(error);
    		// handle the error appropriately or ignore it
    	}
  	};

  	useEffect(() => {
   		getData();
  	}, []);

  	if (user != null) {
    	return (
			<div>
				<h1>Personal profile</h1> 
				<h2>{user.username}</h2> 
					<img
					className='user-card__image'
					src={fetchAddress.slice(0, -1) + `${user.avatarPath?.slice(1)}`}
					alt='user.avatarPath'
					onError={({ currentTarget }) => {
						currentTarget.onerror = null;
						currentTarget.src = '/default_pfp.png';
					}}
					style={styles.profilePictureStyle}
				/>
				<p>Status: {user.status}</p>
				<br/>
				<ul style={styles.listContainerStyle}>
					<li style={styles.listStyle}>
						<p style={styles.statListItemStyle}>Wins: {user.wins}</p>
					</li>
					<li style={styles.listStyle}>
						<p style={styles.statListItemStyle}>Losses: {user.losses}</p>
					</li>
					<li style={styles.listStyle}>
						<p style={styles.statListItemStyle}>Points: {user.points}</p>
					</li>
					<li style={styles.listStyle}>
					</li>
					<li style={styles.listStyle}>
					</li>
				</ul>
				<p>Achievements: {user.achievementsCSV}</p>
				<ul style={styles.listContainerStyle}>
					<li style={styles.listStyle}>
						<img style={styles.achievementListItemStyle} src={imageAssetAchievement1}></img>
					</li>
				</ul>
			</div>
    	);
  	} else {
    	return <div></div>;
  	}
};

export default Private_Div;
