import React, {useState, useEffect} from 'react';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import { login, userSignupAPI } from '../api/authAPI';
import { useUserContext } from './context/UserContext';
import * as styles from './CompleteProfilePageStyles';
import { User } from '../interfaces/user.interface';
import { updateAvatarApi, updateUsernameApi } from '../api/userApi';

// Page props
interface CompleteProfilePageProps {
	onSignUp: (user: User) => void;
}

// Component
const CompleteProfilePage: React.FC<CompleteProfilePageProps> = ({onSignUp}) => {
	const { user, setUser } = useUserContext();

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const intraName = queryParams.get('intraName');

	const [newUsername, setNewUsername] = useState(''); // Sign up state for password input
	const [newAvatar, setNewAvatar] = useState<File | null>(null)

	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const handleCreatingUser = async () => {
		if (!(newUsername.trim().length !== 0)) {
			throw new Error('Please put in a username to continue!');
		  }
		const newUser: User = {
			username: newUsername,
			intraUsername: intraName!,
			userID: 0,
			avatarPath: '',
			wins: 0,
			losses: 0,
			points: 0,
			status: '',
			achievementsCSV: '',
			passwordHash: '',
			friends: [],
			befriendedBy: [],
			blocked: [],
			blockedBy: [],
			adminChannels: [],
			blockedChannels: [],
			channels: [],
			socketId: '',
		  };

		try {
			const newCreatedUser: User = await userSignupAPI(newUser);
			onSignUp(newCreatedUser);
			localStorage.setItem('user', JSON.stringify(newCreatedUser));
			setUser(newCreatedUser);
			navigate(`/`);
		} catch (error) {
			setError('Error creating a new user');
		}
	}

	  const handleUpdateAvatar = async () => {
		try {
		  if (!newAvatar) {
			throw new Error('Please select an image to upload');
		  }
	
		  const formData = new FormData();
          formData.append('img', newAvatar);
		//   const userObject = await updateAvatarApi(userID, formData);
		//   setUpdatedUser(userObject);
		//   setUser(userObject);
		//   localStorage.setItem('user', JSON.stringify(userObject));
		} catch (error) {
		  throw new Error('Error updating avatar. Try again!');
		}
	  };

	// Extract the filename from the File object and update the state
	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		console.log('Selected file:', file);
		if (file) {
			setNewAvatar(file);
		}
	};

    return (<div>
				<div>
					<p style={styles.settingsTitleStyle}>Complete your profile {intraName}</p>
					<img
						className='user-card__image'
						src={`http://localhost:3000/avatars/${user?.avatarPath}`}
						alt='user.avatarPath'
						onError={({ currentTarget }) => {
							currentTarget.onerror = null;
							currentTarget.src = '/default_pfp.png';
						}}
						style={styles.profilePictureStyle}
						/>
					<form>
					<input
						type="text"
						placeholder={user?.intraUsername}
						value={newUsername}
						onChange={(e) => setNewUsername(e.target.value)} // Update state on change
						style={styles.formFieldStyle}
					/>
					</form>
					<form>
					<input type="file" onChange={handleAvatarChange} style={styles.formFieldStyle}/>
					</form>
					<button style={styles.updateButtonStyle} onClick={handleCreatingUser}>
						Sign up
					</button>
				</div>
            </div>)
};

export default CompleteProfilePage;
