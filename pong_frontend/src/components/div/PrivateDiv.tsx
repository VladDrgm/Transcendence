import React, { useEffect, useState } from 'react';
import * as styles from './PrivateDivStyles';
import { getPrivateProfile } from '../../api/profile.api';
import { useUserContext } from '../context/UserContext';
import imageAssetAchievement1 from '../assets/achievement1.png'
import { fetchAddress } from './ChannelDiv';
import { achievementListItemStyle, achievementTextStyle, centeredContainerStyle, listContainerStyle, listStyle } from './UserProfileSyles';

interface PrivateDivProps
{
  userID: number | undefined;
}

const PrivateDiv: React.FC<PrivateDivProps> = ({userID}) => {
	const { user, setUser } = useUserContext();	
	const [profilePicture, setProfilePicture] = useState(false);
	
  	const getData = async () => {
    	try {
      		const myProf = await getPrivateProfile(userID, user?.intraUsername, user?.passwordHash);
			user!.status = "Online";
			user!.wins = myProf.wins;
			user!.losses = myProf.losses;
			user!.points = myProf.points;
			user!.achievementsCSV = myProf.achievementsCSV;
      		setUser(user);
    	} catch (error) {
      		console.error(error);
    	}
	}
  	
	const handleProfilePicture = () => {
		setProfilePicture(true);
	  }

	  const renderProfilePicture = () => {
		if (profilePicture || !user?.avatarPath) {
		  return (
			<img
			  className='user-card__image'
			  src='/default_pfp.png'
			  alt=''
			  style={styles.profilePictureStyle}
			/>
		  );
		} else {
		  return (
			<img
			  className='user-card__image'
			  src={fetchAddress.slice(0, -1) + `${user.avatarPath?.slice(1)}`}
			  alt='user.avatarPath'
			  onError={handleProfilePicture}
			  style={styles.profilePictureStyle}
			/>
		  );
		}
	  }
	const renderAchievements = () => {
		if (user?.achievementsCSV) {
		  const achievements = user.achievementsCSV.split(';');
		  return (
			<div>
			  <h3>Achievements</h3>
			  <ul style={listContainerStyle}>
				{achievements.map((achievement, index) => (
				  <li key={index} style={listStyle}>
					<img style={achievementListItemStyle} src={imageAssetAchievement1} alt="Achievement" />
					<span style={achievementTextStyle}>{achievement}</span>
				  </li>
				))}
			  </ul>
			</div>
		  );
		}
		return null;
	  };

  	useEffect(() => {
		if (!user) {
			console.error('You are not logged in!');
			return;
		  }
   		getData();
  	}, []);

  	if (user != null) {
    	return (
			<div>
				<h1>{user.username}&apos;s profile</h1> 
				{renderProfilePicture()}
				<p>Status: Online</p>
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
				<div style={centeredContainerStyle}>
            		{renderAchievements()}
         		</div>
			</div>
    	);
  	} else {
    	return <div></div>;
  	}
};

export default PrivateDiv;
