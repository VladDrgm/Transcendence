import React, {useState, useEffect} from 'react';
import {main_div_mode_t} from '../MainDivSelector'
import Private_Div from '../div/private_div';
import FriendList from '../div/friend_list_div';
import { getMyID } from '../../api/profile.api';
import Friend_Div from '../div/friend_div';


export enum ProfileType_t
{
  PERSONAL_PROFILE,
  FRIEND_PROFILE,
  PUBLIC_PROFILE
}

interface ProfileProps
{
  userID: number;
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const Profile_MainDiv: React.FC<ProfileProps> = ({userID, mode_set, friend_set}) => {
  const [idTxt, setid] = useState<string>();
        return (<div>
                  <Private_Div userID={userID}/>
                  <hr/>
                  <FriendList userID={userID} mode_set={mode_set} friend_set={friend_set}/>
                </div>)
};

export default Profile_MainDiv;
