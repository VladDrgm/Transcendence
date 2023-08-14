import React, {useState, useEffect} from 'react';
import Private_Div from '../div/private_div';
import FriendList from '../div/friend_list_div';


export enum ProfileType_t
{
  PERSONAL_PROFILE,
  FRIEND_PROFILE,
  PUBLIC_PROFILE
}

interface ProfilePageProps
{
  userID: number;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({userID, friend_set}) => {
  const [idTxt, setid] = useState<string>();
        return (<div>
                  <Private_Div userID={userID}/>
                  <hr/>
                  <FriendList userID={userID} friend_set={friend_set}/>
                </div>)
};

export default ProfilePage;
