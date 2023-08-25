import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/user.interface';
import { useUserContext } from '../context/UserContext';
import { updateAvatarApi, updatePasswordApi, updateUsernameApi } from '../../api/userApi';
import * as styles from './SettingsPageStyles';
import { getPrivateProfile } from '../../api/profile.api';

interface SettingsPageProps
{
	onLogout: () => void;
}

// Component
const SettingsPage: React.FC<SettingsPageProps> = ({onLogout}) => {
	const { user, setUser } = useUserContext();
	const [updatedUser, setUpdatedUser] = useState<User | null>(user);
	const [newPassword, setNewPassword] = useState(''); // Sign up state for password input
	const [newUsername, setNewUsername] = useState(''); // Sign up state for password input
	const [newAvatar, setNewAvatar] = useState<File | null>(null)

	const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
	const [ErrorMessage, setErrorMessage] = useState<string>('');

	const userID = user?.userID;

	const navigate = useNavigate();
  
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
		  setShowErrorMessage(false);
		} catch (error) {
		  setErrorMessage('Error updating password. Try again!');
		  setShowErrorMessage(true);
		}
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
		  setShowErrorMessage(false);
		  
		} catch (error) {
		  setErrorMessage('Error updating username. Try again!');
		  setShowErrorMessage(true);
		}
		
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
		  setNewAvatar(null);
		  setShowErrorMessage(false);
		} catch (error) {
		  setErrorMessage('Error updating avatar. Try again!');
		  setShowErrorMessage(true);
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

const OnLogoutButtonClick = async () => {
	onLogout()

	console.log('User avatarPath:', user?.avatarPath);
	navigate(`/`);

};

return (
	<div>
	  <div>
		<p style={styles.settingsTitleStyle}>Settings</p>
		<img
			className='user-card__image'
			src={`http://localhost:3000${user?.avatarPath?.slice(1)}`}
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
			placeholder={user?.username}
			value={newUsername}
			onChange={(e) => setNewUsername(e.target.value)} // Update state on change
			style={styles.formFieldStyle}
		  />
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
		  <button style={styles.updateButtonStyle} onClick={handleUpdatePassword}>
			Update
		  </button>
		  <input type="file" onChange={handleAvatarChange} style={styles.formFieldStyle}/>
		  <button style={styles.updateButtonStyle} onClick={handleUpdateAvatar}>
			Update
		  </button>
		  {showErrorMessage && <p>{ErrorMessage}</p>}
		<button style={styles.logoutButtonStyle} onClick={OnLogoutButtonClick}>
		  Logout
		</button>
	  </div>
	</div>
  );
};

export default SettingsPage;