import React, { useEffect, useState, ChangeEvent  } from 'react';
import * as styles from './private_divStyles';
import { PrivateProfile } from '../../interfaces/private_profile.interface';
import { getPrivateProfile } from '../../api/profile.api';
import { useUserContext } from '../context/UserContext';

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
					src={`http://localhost:3000${user.avatarPath?.slice(1)}`}
					alt='user.avatarPath'
					onError={({ currentTarget }) => {
						currentTarget.onerror = null;
						currentTarget.src = '/default_pfp.png';
					}}
					style={styles.profilePictureStyle}
				/>
				<br/>
				<p>Wins: {user.wins}</p>
				<p>Losses: {user.losses}</p>
				<p>Points: {user.points}</p>
				<p>Status: {user.status}</p>
				<p>Achievements: {user.achievementsCSV}</p>
			</div>
    	);
  	} else {
    	return <div></div>;
  	}
};

export default Private_Div;
