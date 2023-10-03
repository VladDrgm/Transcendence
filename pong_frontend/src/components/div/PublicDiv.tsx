import React, { useEffect, useState } from 'react';
import { PublicProfile } from '../../interfaces/PublicProfile';
import { getPublicProfile } from '../../api/profile.api';
import { achievementListItemStyle, achievementTextStyle, centeredContainerStyle, listContainerStyle, listStyle, profilePictureStyle } from './UserProfileSyles';
import imageAssetAchievement1 from '../assets/achievement1.png'
import { fetchAddress } from './ChannelDiv';

interface PublicProps {
  userID: number;
  publicID: number;
}

const PublicDiv: React.FC<PublicProps> = ({ userID, publicID }) => {
  const [user, setFriend] = useState<PublicProfile>();

  const getData = async () => {
    try{
      const friend = await getPublicProfile(publicID);
      setFriend(friend);
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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

  if (user != null) {
    return (
      <div>
        <h2>{user.username}'s profile</h2>
        <img
					className='user-card__image'
					src={fetchAddress.slice(0, -1) + `${user.avatarPath?.slice(1)}`}
					alt='user.avatarPath'
					onError={({ currentTarget }) => {
						currentTarget.onerror = null;
						currentTarget.src = '/default_pfp.png';
					}}
					style={profilePictureStyle}
				/>
				<br/>
        <div style={centeredContainerStyle}>{renderAchievements()}</div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default PublicDiv;
