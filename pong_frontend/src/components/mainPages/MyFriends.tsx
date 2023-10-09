import React, { useEffect } from 'react';
import * as styles from './ProfilePageStyles';
import FriendList from '../div/FriendList';
import { useUserContext } from '../context/UserContext';
import { postUserStatus } from '../../api/statusUpdateAPI.api';
import { useNavigate } from 'react-router-dom';
interface MyFriendsPageProps
{
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const MyFriendsPage: React.FC<MyFriendsPageProps> = ({friend_set}) => {
	const { user } = useUserContext();
	const navigate = useNavigate();

	useEffect(() => {
		// Check if the user is logged in when the component mounts
		if (!user) {
			navigate('/login'); // Redirect to the login page if not logged in
		}
		postUserStatus("Online", user!);
  	}, [navigate]);
	return (
		<div style={styles.pageStyle}>
            <FriendList userID={user?.userID} friend_set={friend_set}/>
        </div>
	)
};

export default MyFriendsPage;
