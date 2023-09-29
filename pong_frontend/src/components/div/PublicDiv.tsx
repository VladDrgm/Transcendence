import React, { useEffect, useState } from 'react';
import { PublicProfile } from '../../interfaces/public_profile.interface';
import { getPublicProfile } from '../../api/profile.api';
import { achievementListItemStyle, achievementTextStyle, centeredContainerStyle, listContainerStyle, listStyle, statListItemStyle } from './UserProfileSyles';
import imageAssetAchievement1 from '../assets/achievement1.png'

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
        <div style={centeredContainerStyle}>
          <ul style={listContainerStyle}>
            <li style={listStyle}>
              <p style={statListItemStyle}>Wins: {user.wins}</p>
            </li>
            <li style={listStyle}>
              <p style={statListItemStyle}>Losses: {user.losses}</p>
            </li>
            <li style={listStyle}>
              <p style={statListItemStyle}>Points: {user.points}</p>
            </li>
          </ul>
        </div>
        <div style={centeredContainerStyle}>{renderAchievements()}</div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default PublicDiv;
