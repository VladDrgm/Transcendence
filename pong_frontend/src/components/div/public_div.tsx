import React, { useEffect, useState } from 'react';
import { PublicProfile } from '../../interfaces/public_profile.interface';
import { getPublicProfile } from '../../api/profile.api';
import defaultProfile from '../../default_profiile.jpg';

interface PublicProps {
  userID: number;
  publicID: number;
  //probably add function to set type of profile
}

const Public_Div: React.FC<PublicProps> = ({ userID, publicID }) => {
  const [user, setFriend] = useState<PublicProfile>();

  const getData = async () => {
    try{
      const friend = await getPublicProfile(publicID);
      setFriend(friend);
    }
    catch (error) {
      console.error(error);
    // handle the error appropriately or ignore it
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (user != null) {
    return (
      <div>
        <h2>{user.username}</h2>
        <p>Wins: {user.wins}</p>
        <p>Losses: {user.losses}</p>
        <p>Points: {user.points}</p>
        <p>Achievements: {user.achievementsCSV}</p>
      </div>
    );
  } 
  else {
    return <div></div>;
  }
};

export default Public_Div;
