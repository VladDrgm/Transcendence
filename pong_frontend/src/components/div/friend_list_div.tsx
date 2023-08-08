import { FC, useEffect, useState } from 'react';
import { FriendProfile } from '../../interfaces/friend_profile.interface';
import { getFriendList } from '../../api/friend_list.api';
import {main_div_mode_t} from '../MainDivSelector';

interface FriendProps
{
  userID: number;
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const FriendList: FC<FriendProps> = ({userID, mode_set, friend_set}) => {
  const [friends, setFriends] = useState<FriendProfile[]>([]);

  const getData = async() => {
    const users = await getFriendList(userID);
    setFriends(users);
  }

  useEffect(() => {
    getData()
  }, [])
  
  const openFriend = (FID:number) => {
    friend_set(FID);
    mode_set(main_div_mode_t.PUBLIC_PROFILE);
  };

  return (
    <div>
      <h3>Friend List</h3>
        {friends?.map((friend) => (
            <p onClick={() => openFriend(friend.userID)}>{friend.username}: {friend.status}</p>
        ))}
    </div>
  );
};

export default FriendList;