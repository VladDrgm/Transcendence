import React, {useState, useEffect} from 'react';
import {main_div_mode_t} from '../MainDivSelector'
import Private_Div from '../div/private_div';
import FriendList from '../div/friend_list_div';
import { getMyID } from '../../api/profile.api';
import Friend_Div from '../div/friend_div';

interface ProfileProps
{
  userID: number;
//   mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
}

const Profile_MainDiv: React.FC<ProfileProps> = ({userID}) => {
  const [idTxt, setid] = useState<string>();
  const [idfriend, setFid] = useState<number>(-1);
  const getData = async () => {
    try{
      const myProf = await getMyID();
      setid(myProf);
    }
    catch (error) {
      console.error(error);
    // handle the error appropriately or ignore it
    }
  };

  const set_ownProfile = () => {
    setFid(-1);
  };

  useEffect(() => {
    getData();
  }, []);

    switch (idfriend){
      case (-1):
        return (<div>
                  <div>
                  <p>Welcome {userID}. This is your profile on server {idTxt}. </p> 
                  </div>
                  <Private_Div/>
                  <hr/>
                  <FriendList userID={userID} friend_set={setFid}/>
                </div>)
      default :
        return (<div>
          <div>
            <p>This is friends porfile </p> 
            <br/> 
          </div>
          <Friend_Div userID={userID} friendID={idfriend}/>
          <hr/>
          <button onClick={set_ownProfile}>Back to your profile</button>
        </div>)
    };
};

export default Profile_MainDiv;
