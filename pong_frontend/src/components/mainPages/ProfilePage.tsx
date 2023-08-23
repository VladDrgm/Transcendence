import React, {useState, useEffect} from 'react';
import Private_Div from '../div/private_div';
import FriendList from '../div/friend_list_div';
import { useUserContext } from '../context/UserContext';


export enum ProfileType_t
{
  PERSONAL_PROFILE,
  FRIEND_PROFILE,
  PUBLIC_PROFILE
}

interface ProfilePageProps
{
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({friend_set}) => {

	const { user } = useUserContext();

  const [idTxt, setid] = useState<string>();
        return (<div>
                  <Private_Div userID={user?.userID}/>
                  <hr/>
                  <FriendList userID={user?.userID} friend_set={friend_set}/>
                </div>)
};

export default ProfilePage;
