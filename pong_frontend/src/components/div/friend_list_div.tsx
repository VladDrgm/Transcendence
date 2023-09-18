import { FC, useEffect, useState } from 'react';
import { FriendProfile } from '../../interfaces/friend_profile.interface';
import { getFriendList } from '../../api/friend_list.api';
import { useUserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

interface FriendProps
{
  userID: number | undefined;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const FriendList: FC<FriendProps> = ({userID, friend_set}) => {
	const [friends, setFriends] = useState<FriendProfile[]>([]);

	const { user, setUser } = useUserContext();
  	const getData = async() => {
    	const users = await getFriendList(userID, user?.intraUsername, user?.passwordHash);
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
				<Link onClick={() => openFriend(friend.userID)} key={friend.username} to={"/app/public_profile"}>{friend.username}: {friend.status}</Link>


        	))}
    	</div>
  	);
};

export default FriendList;