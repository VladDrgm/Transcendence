import React, { useEffect, useState } from 'react';
import { FriendProfile } from '../../interfaces/friend_profile.interface';
import { getFriendProfile } from '../../api/profile.api';
import { fetchAddress } from './channel_div';
import { useUserContext } from '../context/UserContext';
import imageAssetAchievement1 from '../assets/achievement1.png'
import { achievementListItemStyle, achievementTextStyle, centeredContainerStyle, listContainerStyle, listStyle, profilePictureStyle, statListItemStyle } from './UserProfileSyles';

interface FriendProps {
  userID: number;
  friendID: number;
}

const FriendDiv: React.FC<FriendProps> = ({ userID, friendID }) => {
  const [friend, setFriend] = useState<FriendProfile>();

  const { user } = useUserContext();

  const getData = async () => {
    if (friendID > 0)
    {
      try{
        const friend = await getFriendProfile(userID, friendID,  user?.intraUsername, user?.passwordHash);
        setFriend(friend);
      }
      catch (error) {
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
          <h2>{friend.username}'s profile</h2>
          <p> Status : {friend.status}</p>
          <img
            className='user-card__image'
            src={fetchAddress.slice(0, -1) + `${friend.avatarPath.slice(1)}`}
            alt='user.avatarPath'
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/default_pfp.png';
            }}
            style={profilePictureStyle}
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
