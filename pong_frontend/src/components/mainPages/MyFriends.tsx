import React from 'react';
import * as styles from './ProfilePageStyles';
import FriendList from '../div/FriendList';
import { useUserContext } from '../context/UserContext';

interface MyFriendsPageProps
{
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const MyFriendsPage: React.FC<MyFriendsPageProps> = ({friend_set}) => {
	const { user } = useUserContext();

	return (
		<div style={styles.pageStyle}>
            <FriendList userID={user?.userID} friend_set={friend_set}/>
        </div>
	)
};

export default MyFriendsPage;
