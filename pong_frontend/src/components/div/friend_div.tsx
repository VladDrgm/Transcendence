import React, { useEffect, useState } from 'react';
import { FriendProfile } from '../../interfaces/friend_profile.interface';
import { getFriendProfile } from '../../api/profile.api';

interface FriendProps {
  friendID: number;
}

const Friend_Div: React.FC<FriendProps> = ({ friendID }) => {
  const [user, setFriend] = useState<FriendProfile>();

  const getData = async () => {
    if (friendID > 0)
    {
      try{
        const friend = await getFriendProfile(friendID);
        console.log(friendID);
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
          <h2>{user.nickname}</h2>
          <p>Wins: {user.wins}</p>
          <p>Losses: {user.losses}</p>
          <p>Ladder Level: {user.ladderLevel}</p>
          <p>Status: {user.status}</p>
          <p>Achievements: {user.achievements}</p>
        </div>
      </div>
    );
  } 
  else {
    return <div></div>;
  }
};

export default Friend_Div;
