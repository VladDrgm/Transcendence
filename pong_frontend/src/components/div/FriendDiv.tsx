import React, { useEffect, useState } from 'react';
import { FriendProfile } from '../../interfaces/FriendProfile';
import { getFriendProfile } from '../../api/profile.api';
import { useUserContext } from '../context/UserContext';
import imageAssetAchievement1 from '../assets/achievement1.png'
import { achievementListItemStyle, achievementTextStyle, centeredContainerStyle, listContainerStyle, listStyle, profilePictureStyle, statListItemStyle } from './UserProfileSyles';
import UserProfilePicture from './UserProfilePicture';

interface FriendProps {
  userID: number | undefined;
  friendID: number;
}

const FriendDiv: React.FC<FriendProps> = ({ userID, friendID }) => {
  const [friend, setFriend] = useState<FriendProfile>();

  const { user } = useUserContext();

  const getData = async () => {
    if (friendID > 0) {
      try {
        const friend = await getFriendProfile(userID, friendID, user?.intraUsername, user?.passwordHash);
        setFriend(friend);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderAchievements = () => {
    if (friend?.achievementsCSV) {
      const achievements = friend.achievementsCSV.split(';');
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
    getData();
  }, [friendID]);

  if (friend != null) {
    return (
      <div>
        <div>
            <h2>{friend.username}&apos;s profile</h2>          <UserProfilePicture
            imagePath={friend?.avatarPath}
            defaultImageSrc='/default_pfp.png'
            altText={friend?.username || 'Friend'}
            imageStyle={profilePictureStyle}
          />
          <p>Status: {friend.status}</p>
          <br/>
          <div style={centeredContainerStyle}>
            <ul style={listContainerStyle}>
              <li style={listStyle}>
                <p style={statListItemStyle}>Wins: {friend.wins}</p>
              </li>
              <li style={listStyle}>
                <p style={statListItemStyle}>Losses: {friend.losses}</p>
              </li>
              <li style={listStyle}>
                <p style={statListItemStyle}>Points: {friend.points}</p>
              </li>
            </ul>
          </div>
          <div style={centeredContainerStyle}>
            {renderAchievements()}
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default FriendDiv;
