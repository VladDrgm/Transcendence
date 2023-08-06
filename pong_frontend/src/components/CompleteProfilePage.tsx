import React, {useState} from 'react';
import { useUserContext } from './context/UserContext';
import * as styles from './CompleteProfilePageStyles';
import { User } from '../interfaces/user.interface';
import { updateAvatarApi, updateUsernameApi } from '../api/userApi';

// Page props
interface CompleteProfilePageProps {
	userID: number;
}

// Component
const CompleteProfilePage: React.FC<CompleteProfilePageProps> = ({userID}) => {
	const { user, setUser } = useUserContext();

	const [updatedUser, setUpdatedUser] = useState<User>(user);
	const [newUsername, setNewUsername] = useState(''); // Sign up state for password input
	const [newAvatar, setNewAvatar] = useState<File | null>(null)

	const [showUpdateUsernameSuccessMessage, setShowUpdateUsernameSuccessMessage] = useState(false);
	const [showUpdateAvatarSuccessMessage, setShowUpdateAvatarSuccessMessage] = useState(false);

	  const handleUpdateUsername = async () => {
		try {
		  // Call the API function and get the updated user object
		  const updatedUser = await updateUsernameApi(userID, newUsername);
	  
		  // Update the state and local storage with the updated user object
		  setUpdatedUser(updatedUser);
		  setUser(updatedUser);
		  localStorage.setItem('user', JSON.stringify(updatedUser));
	  
		  // Clear the input field after successful update
		  setNewUsername('');

		  setShowUpdateUsernameSuccessMessage(true);
		} catch (error) {
		  throw new Error('Error updating username. Try again!');
		}
		setShowUpdateUsernameSuccessMessage(false);
	  };

	  const handleUpdateAvatar = async () => {
		try {
		  if (!newAvatar) {
			throw new Error('Please select an image to upload');
		  }
	
		  const formData = new FormData();
          formData.append('img', newAvatar);
		  const userObject = await updateAvatarApi(userID, formData);
		  setUpdatedUser(userObject);
		  setUser(userObject);
		  localStorage.setItem('user', JSON.stringify(userObject));
		  setShowUpdateAvatarSuccessMessage(true);
		} catch (error) {
		  throw new Error('Error updating avatar. Try again!');
		}
		setShowUpdateAvatarSuccessMessage(false);
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
					<p style={styles.settingsTitleStyle}>Complete your profile</p>
					<img
						className='user-card__image'
						src={`http://localhost:3000/avatars/${user.avatarPath}`}
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
						placeholder={user.intraUsername}
						value={newUsername}
						onChange={(e) => setNewUsername(e.target.value)} // Update state on change
						style={styles.formFieldStyle}
					/>
					{showUpdateUsernameSuccessMessage && <p>Successfully update the username</p>}
					<button style={styles.updateButtonStyle} onClick={handleUpdateUsername}>
						Update
					</button>
					</form>
					<form>
					<input type="file" onChange={handleAvatarChange} style={styles.formFieldStyle}/>
					{showUpdateAvatarSuccessMessage && <p>Successfully update the avatar</p>}
					<button style={styles.updateButtonStyle} onClick={handleUpdateAvatar}>
						Update
					</button>
					</form>
				</div>
            </div>)
};

export default CompleteProfilePage;
