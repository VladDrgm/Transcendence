import { FC, useEffect, useState } from 'react';
import { FriendProfile_List } from '../../interfaces/friend_list.inerface';
import { getFriendList } from '../../api/friend_list.api';

interface FriendProps
{
  userID: number;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const FriendList: FC<FriendProps> = ({userID, friend_set}) => {
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