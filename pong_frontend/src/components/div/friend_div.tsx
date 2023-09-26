import React, { useEffect, useState } from 'react';
import { FriendProfile } from '../../interfaces/friend_profile.interface';
import { getFriendProfile } from '../../api/profile.api';
import defaultProfile from '../../default_profiile.jpg';
import { fetchAddress } from './channel_div';
import CSS from 'csstype';
import { useUserContext } from '../context/UserContext';

interface FriendProps {
  userID: number;
  friendID: number;
}

const Friend_Div: React.FC<FriendProps> = ({ userID, friendID }) => {
  const [friend, setFriend] = useState<FriendProfile>();

  const profilePictureStyle: CSS.Properties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '20px',
    border: '3px solid rgba(254, 8, 16, 1)',
  };

  const { user, setUser } = useUserContext();

  const getData = async () => {
    if (friendID > 0)
    {
      try{
        const friend = await getFriendProfile(userID, friendID,  user?.intraUsername, user?.passwordHash);
        setFriend(friend);
      }
      catch (error) {
        console.error(error);
      // handle the error appropriately or ignore it
      }
    }
  };

  useEffect(() => {
    getData();
  }, [friendID]);

  if (friend != null) {
    return (
      <div>
        <div>
          <h2>{friend.username}</h2>
          <img
            className='user-card__image'
            src={fetchAddress.slice(0,-1) + `${friend.avatarPath.slice(1)}`}
            alt='user.avatarPath'
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/default_pfp.png';
            }}
            style={profilePictureStyle}
          />
          <p>Wins: {friend.wins}</p>
          <p>Losses: {friend.losses}</p>
          <p>Points: {friend.points}</p>
          <p>Status: {friend.status}</p>
          <p>Achievements: {friend.achievementsCSV}</p>
        </div>
      </div>
    );
  } 
  else {
    return <div></div>;
  }
};

export default Friend_Div;
