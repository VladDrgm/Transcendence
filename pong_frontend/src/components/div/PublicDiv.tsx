import React, { useEffect, useState } from 'react';
import { PublicProfile } from '../../interfaces/PublicProfile';
import { getPublicProfile } from '../../api/profile.api';
import { achievementListItemStyle, achievementTextStyle, centeredContainerStyle, listContainerStyle, listStyle, profilePictureStyle } from './UserProfileSyles';
import imageAssetAchievement1 from '../assets/achievement1.png'
import UserProfilePicture from './UserProfilePicture';

interface PublicProps {
  userID: number | undefined;
  publicID: number;
}

const PublicDiv: React.FC<PublicProps> = ({ userID, publicID }) => {
  const [user, setUser] = useState<PublicProfile>();

  const getData = async () => {
    try {
      const friend = await getPublicProfile(publicID);
      setUser(friend);
    } catch (error) {
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
        <h2>{user.username}&apos;s profile</h2>
        <UserProfilePicture
          imagePath={user?.avatarPath}
          defaultImageSrc='/default_pfp.png'
          altText={user?.username || 'User'}
          imageStyle={profilePictureStyle}
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
