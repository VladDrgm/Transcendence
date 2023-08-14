import React, {useState} from 'react';
import { User } from '../../interfaces/user.interface';
import { useUserContext } from '../context/UserContext';
import { updateAvatarApi, updatePasswordApi, updateUsernameApi } from '../../api/userApi';
import * as styles from './SettingsPageStyles';
import { getPrivateProfile } from '../../api/profile.api';

interface SettingsPageProps
{
	onLogout: () => void;
	userID: number;
}

// Component
const SettingsPage: React.FC<SettingsPageProps> = ({onLogout, userID}) => {
	const { user, setUser } = useUserContext();
	const [updatedUser, setUpdatedUser] = useState<User>(user);
	const [newPassword, setNewPassword] = useState(''); // Sign up state for password input
	const [newUsername, setNewUsername] = useState(''); // Sign up state for password input
	const [newAvatar, setNewAvatar] = useState<File | null>(null)

	const [showUpdatePasswordSuccessMessage, setShowUpdatePasswordSuccessMessage] = useState(false);
	const [showUpdateUsernameSuccessMessage, setShowUpdateUsernameSuccessMessage] = useState(false);
	const [showUpdateAvatarSuccessMessage, setShowUpdateAvatarSuccessMessage] = useState(false);
  
	//   // Add a conditional rendering to check if user is available
	//   if (!user || !user.avatarPath) {
	// 	// Return a loading state or null
	// 	return <p>Loading...</p>;
	//   }

	const handleUpdatePassword = async () => {
		try {
		  // Call the API function and get the updated user object
		  const userObject = await updatePasswordApi(userID, newPassword);
	  
		  // Update the state and local storage with the updated user object
		  setUpdatedUser(userObject);
		  setUser(userObject);
		  localStorage.setItem('user', JSON.stringify(userObject));
	  
		  setShowUpdatePasswordSuccessMessage(true);
		} catch (error) {
		  throw new Error('Error updating password. Try again!');
		}
		setShowUpdatePasswordSuccessMessage(false);
	  };

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
          formData.append('file', newAvatar);
		  await updateAvatarApi(userID, formData);
		  const myProf = await getPrivateProfile(userID);
		  setUpdatedUser(myProf);
		  setUser(myProf);
		  localStorage.setItem('user', JSON.stringify(myProf));
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

const OnLogoutButtonClick = async () => {
	onLogout()

	console.log('User avatarPath:', user.avatarPath);

};

return (
	<div>
	  <div>
		<p style={styles.settingsTitleStyle}>Settings</p>
		<img
			className='user-card__image'
			src={`http://localhost:3000${user.avatarPath.slice(1)}`}
			alt='user.avatarPath'
			onError={({ currentTarget }) => {
				currentTarget.onerror = null;
				currentTarget.src = '/default_pfp.png';
			}}
			style={styles.profilePictureStyle}
			/>
			<br/>
		  <input
			type="text"
			placeholder={user.username}
			value={newUsername}
			onChange={(e) => setNewUsername(e.target.value)} // Update state on change
			style={styles.formFieldStyle}
		  />
		  {showUpdateUsernameSuccessMessage && <p>Successfully update the username</p>}
		  <button style={styles.updateButtonStyle} onClick={handleUpdateUsername}>
			Update
		  </button>
		  <input
			type="password"
			placeholder="Type in new password"
			value={newPassword}
			onChange={(e) => setNewPassword(e.target.value)} // Update state on change
			style={styles.formFieldStyle}
		  />
		  {showUpdatePasswordSuccessMessage && <p>Successfully update the password</p>}
		  <button style={styles.updateButtonStyle} onClick={handleUpdatePassword}>
			Update
		  </button>
		  <input type="file" onChange={handleAvatarChange} style={styles.formFieldStyle}/>
		  {showUpdateAvatarSuccessMessage && <p>Successfully update the avatar</p>}
		  <button style={styles.updateButtonStyle} onClick={handleUpdateAvatar}>
			Update
		  </button>
		<button style={styles.logoutButtonStyle} onClick={OnLogoutButtonClick}>
		  Logout
		</button>
	  </div>
	</div>
  );
};

export default SettingsPage;