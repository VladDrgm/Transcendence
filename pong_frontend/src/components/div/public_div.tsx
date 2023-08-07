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
        <div>
          <h2>{user.username}</h2>
          {(user.avatarPath.substring(0, 5) != "https") && (
            <img src={defaultProfile} alt="default profile" width="400" height="300"/>
          )}
          {(user.avatarPath.substring(0, 5) === "https")  && (
            <img src={user.avatarPath} alt={user.username} width="400" height="300"/>
          )}
        </div>
        <button>Make Friend</button>
      </div>
    );
  } 
  else {
    return <div></div>;
  }
};

export default Public_Div;
