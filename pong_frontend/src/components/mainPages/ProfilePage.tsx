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
<<<<<<< HEAD:pong_frontend/src/components/mainPages/ProfilePage.tsx
}

const ProfilePage: React.FC<ProfilePageProps> = ({userID}) => {
=======
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const Profile_MainDiv: React.FC<ProfileProps> = ({userID, mode_set, friend_set}) => {
>>>>>>> main:pong_frontend/src/components/main_div/Profile_MainDiv.tsx
  const [idTxt, setid] = useState<string>();
        return (<div>
                  <Private_Div userID={userID}/>
                  <hr/>
                  <FriendList userID={userID} mode_set={mode_set} friend_set={friend_set}/>
                </div>)
};

export default ProfilePage;
