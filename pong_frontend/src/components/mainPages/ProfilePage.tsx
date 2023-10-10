import React, { useEffect } from 'react';
import * as styles from './ProfilePageStyles';
import PrivateProfile from '../div/PrivateDiv';
import { useUserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { ButtonStyle } from '../div/UserProfileSyles';
import { useNavigate } from 'react-router-dom';

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
	const navigate = useNavigate();

	useEffect(() => {
		// Check if the user is logged in when the component mounts
		if (!user) {
			navigate('/login'); // Redirect to the login page if not logged in
		}
  	}, []);

	return (
		<div style={styles.pageStyle}>
      <PrivateProfile userID={user?.userID}/>
      <Link to="/app/settings">
          <button style={ButtonStyle}>Settings</button>
      </Link>
    </div>
	)
};

export default ProfilePage;
