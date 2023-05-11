import React, { useEffect, useState } from 'react';
import { PrivateProfile } from '../../interfaces/private_profile.interface';
import { getPrivateProfile } from '../../api/profile.api';

interface PrivateProps {
}

const Private_Div: React.FC<PrivateProps> = () => {
  const [user, setUser] = useState<PrivateProfile>();

  const getData = async () => {
    try{
      const myProf = await getPrivateProfile();
      setUser(myProf);
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

export default Private_Div;
