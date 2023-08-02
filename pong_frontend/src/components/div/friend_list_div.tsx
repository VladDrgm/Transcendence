import { FC, useEffect, useState } from 'react';
import { FriendProfile_List } from '../../interfaces/friend_list.inerface';
import { getFriendList } from '../../api/friend_list.api';
import {main_div_mode_t} from '../MainDivSelector';

interface FriendProps
{
  userID: number;
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const FriendList: FC<FriendProps> = ({userID, mode_set, friend_set}) => {
  const [friends, setFriends] = useState<FriendProfile_List[]>([]);

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
            <p onClick={() => openFriend(friend.friendUser.userID)}>{friend.friendUser.username}: {friend.friendUser.status}</p>
        ))}
    </div>
  );
};

export default FriendList;