import React, {useState, useEffect} from 'react';
import {main_div_mode_t} from '../MainDivSelector';
import Public_Div from '../div/public_div';
import FriendList from '../div/friend_list_div';
import { getMyID } from '../../api/profile.api';
import Friend_Div from '../div/friend_div';


export enum ProfileType_t
{
  FRIEND_PROFILE,
  PUBLIC_PROFILE
}

interface ProfileProps
{
  userID: number;
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
  friend_ID: number;
}

const User_MainDiv: React.FC<ProfileProps> = ({userID, mode_set, friend_ID}) => {
    const [type, set_type] = useState<ProfileType_t>(ProfileType_t.PUBLIC_PROFILE);
    const set_ownProfile = () => {
        mode_set(main_div_mode_t.PROFILE);
      };

    switch(type){
        case (ProfileType_t.FRIEND_PROFILE):
            return (<div>
            <div>
                <p>This is friends porfile </p> 
                <br/> 
            </div>
            <Friend_Div userID={userID} friendID={friend_ID}/>
            <hr/>
            <button onClick={set_ownProfile}>Back to your profile</button>
            </div>)
        case (ProfileType_t.PUBLIC_PROFILE):
            return (<div>
                <div>
                <p>This is public porfile </p> 
                <br/> 
                </div>
                <Public_Div userID={userID} publicID={friend_ID}/>
                <hr/>
                <button onClick={set_ownProfile}>Back to your profile</button>
            </div>)
    }
}

