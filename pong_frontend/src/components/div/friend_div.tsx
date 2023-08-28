import React, { useEffect, useState } from 'react';
import { FriendProfile } from '../../interfaces/friend_profile.interface';
import { getFriendProfile } from '../../api/profile.api';
import defaultProfile from '../../default_profiile.jpg';
import CSS from 'csstype';

interface FriendProps {
  userID: number;
  friendID: number;
}

const Friend_Div: React.FC<FriendProps> = ({ userID, friendID }) => {
  const [user, setFriend] = useState<FriendProfile>();

  const profilePictureStyle: CSS.Properties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '20px',
    border: '3px solid rgba(254, 8, 16, 1)',
  };

  const getData = async () => {
    if (friendID > 0)
    {
      try{
        const friend = await getFriendProfile(userID, friendID);
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

  if (user != null) {
    return (
      <div>
        <div>
          <h2>{user.username}</h2>
          <img
            className='user-card__image'
            src={`http://localhost:3000${user.avatarPath.slice(1)}`}
            alt='user.avatarPath'
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/default_pfp.png';
            }}
            style={profilePictureStyle}
          />
          <p>Wins: {user.wins}</p>
          <p>Losses: {user.losses}</p>
          <p>Points: {user.points}</p>
          <p>Status: {user.status}</p>
          <p>Achievements: {user.achievementsCSV}</p>
        </div>
        <button>Chat</button>
        <button>Match</button>
      </div>
    );
  } 
  else {
    return <div></div>;
  }
};

export default Friend_Div;
