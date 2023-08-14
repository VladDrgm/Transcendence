import { FC, useEffect, useState } from 'react';
import { FriendProfile } from '../../interfaces/friend_profile.interface';
import { getFriendList } from '../../api/friend_list.api';

interface FriendProps
{
  userID: number;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const FriendList: FC<FriendProps> = ({userID, friend_set}) => {
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