import React, { useEffect, useState } from 'react';
import { FriendProfile } from '../../interfaces/friend_profile.interface';
import { getFriendProfile } from '../../api/profile.api';

interface FriendProps {
  userID: number;
  friendID: number;
}

const Friend_Div: React.FC<FriendProps> = ({ userID, friendID }) => {
  const [user, setFriend] = useState<FriendProfile>();

  const getData = async () => {
    if (friendID > 0)
    {
      try{
        const friend = await getFriendProfile(userID, friendID);
        console.log(friendID + " a" + userID);
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
          <img src={user.avatarPath} alt={user.username} />
          <p>Wins: {user.wins}</p>
          <p>Losses: {user.losses}</p>
          <p>Points: {user.points}</p>
          <p>Status: {user.status}</p>
          <p>Achievements: {user.achievementsCSV}</p>
        </div>
      </div>
    );
  } 
  else {
    return <div></div>;
  }
};

export default Friend_Div;
