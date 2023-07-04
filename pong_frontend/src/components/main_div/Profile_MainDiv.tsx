import React, {useState, useEffect} from 'react';
import {main_div_mode_t} from '../MainDivSelector'
import Private_Div from '../div/private_div';
import { getMyID } from '../../api/profile.api';

interface ProfileProps
{
  userID: number;
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
}

const Profile_MainDiv: React.FC<ProfileProps> = ({userID, mode_set}) => {
  const [idTxt, setid] = useState<string>();
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

  useEffect(() => {
    getData();
  }, []);

    return (<div>
              <div>
                <p>Welcome {userID}. This is your profile on server {idTxt}. </p> 
                <br/> 
                <p>Search for our friends here:</p>
                <button onClick={() => mode_set(main_div_mode_t.FRIEND_PROFILE)}>Search friends</button>
              </div>
              <Private_Div/>
            </div>)
};

export default Profile_MainDiv;
