import React, {useState, useEffect} from 'react';
// import {main_div_mode_t} from '../MainDivSelector';
import Public_Div from '../div/public_div';

import Friend_Div from '../div/friend_div';
import { checkFriend, addFriend, removeFriend } from '../../api/friend_list.api';
import { useUserContext } from '../context/UserContext';


export enum ProfileType_t
{
  FRIEND_PROFILE,
  PUBLIC_PROFILE
}

interface ProfileProps
{
  friend_ID: number;
}

const PublicProfile_MainDiv: React.FC<ProfileProps> = ({friend_ID}) => {
    const [type, set_type] = useState<ProfileType_t>(ProfileType_t.PUBLIC_PROFILE);
    const set_ownProfile = () => {
        // mode_set(main_div_mode_t.PROFILE);
      };
      const { user, setUser } = useUserContext();
      const userID = user!.userID;
      const isFriend = async () => {
        try{
          const ret = await checkFriend(userID, friend_ID, user?.intraUsername, user?.passwordHash);
          if (ret)
          {
            set_type(ProfileType_t.FRIEND_PROFILE);
          }
          else
          {
            set_type(ProfileType_t.PUBLIC_PROFILE);
          }
        }
        catch (error) {
          console.error(error);
        // handle the error appropriately or ignore it
        }
      };

      const addFriend_private = async () => {
        try{
          await addFriend(userID, friend_ID, user?.intraUsername, user?.passwordHash);
          isFriend();
        }
        catch (error) {
          console.error(error);
        // handle the error appropriately or ignore it
        }
      };

      const removeFriend_private = async () => {
        try{
          await removeFriend(userID, friend_ID, user?.intraUsername, user?.passwordHash);
          isFriend();
        }
        catch (error) {
          console.error(error);
        // handle the error appropriately or ignore it
        }
      };

      useEffect(() => {
        isFriend();
      }, []);

    switch(type){
        case (ProfileType_t.FRIEND_PROFILE):
            return (<div>
            <div>
                <p>This is friends profile </p> 
                <br/> 
            </div>
            <Friend_Div userID={userID} friendID={friend_ID}/>
            <hr/>
            <button onClick={set_ownProfile}>Back to your profile</button>
            <button onClick={removeFriend_private}>Unfriend</button>
            </div>)
        case (ProfileType_t.PUBLIC_PROFILE):
            return (<div>
                <div>
                <p>This is public profile </p> 
                <br/> 
                </div>
                <Public_Div userID={userID} publicID={friend_ID}/>
                <hr/>
                <button onClick={addFriend_private}>Add Friend</button>
                <button onClick={set_ownProfile}>Back to your profile</button>
            </div>)
    }
};

export default PublicProfile_MainDiv;