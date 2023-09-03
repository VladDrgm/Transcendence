import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/user.interface';
import { useUserContext } from '../context/UserContext';
import { updateAvatarApi, updatePasswordApi, updateUsernameApi } from '../../api/userApi';
import * as styles from './SettingsPageStyles';
import imageAssetUploadAvatar from '../assets/uploadAvatar.png'
import { getPrivateProfile } from '../../api/profile.api';
import { fetchAddress } from '../div/channel_div';

interface SettingsPageProps
{
	onLogout: () => void;
}

// Component
const SettingsPage: React.FC<SettingsPageProps> = ({onLogout}) => {
	const { user, setUser } = useUserContext();
	// const [updatedUser, setUpdatedUser] = useState<User | undefined>(user);
	const [newUsername, setNewUsername] = useState(''); // Sign up state for password input
	const [newAvatar, setNewAvatar] = useState<File | null>(null)

	const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
	const [ErrorMessage, setErrorMessage] = useState<string>('');
	const [selectedImage, setSelectedImage] = useState<string>(fetchAddress.slice(0, -1) + user?.avatarPath?.slice(1));
	const [border, setImageBorder] = useState<string>('3px solid rgba(254, 8, 16, 1)');
	const userID = user?.userID;

	const navigate = useNavigate();
  
	//   // Add a conditional rendering to check if user is available
	//   if (!user || !user.avatarPath) {
	// 	// Return a loading state or null
	// 	return <p>Loading...</p>;
	//   }

	const handleUpdateUsername = async () => {
		
		let updatedUser =  null;
		try {
			// Call the API function and get the updated user object
			updatedUser = await updateUsernameApi(userID, newUsername);
	  
			// Update the state and local storage with the updated user object
			
	  
			// Clear the input field after successful update
			setNewUsername('');
			setShowErrorMessage(false);
		  
		} catch (error) {
			setErrorMessage('Error updating username. Try again!');
			setShowErrorMessage(true);
		}
		// setUpdatedUser(updatedUser);
		setUser(updatedUser);
		localStorage.setItem('user', JSON.stringify(updatedUser));
	};

	const handleUpdateAvatar = async () => {
		try {
			if (!newAvatar) {
				throw new Error('Please select an image to upload');
			}

			const formData = new FormData();
			formData.append('file', newAvatar);
			await updateAvatarApi(userID, formData);
			setSelectedImage(fetchAddress.slice(0, -1) + user?.avatarPath?.slice(1));
			setImageBorder('3px solid rgba(254, 8, 16, 1)');setSelectedImage(fetchAddress.slice(0, -1) + user?.avatarPath?.slice(1));
			setNewAvatar(null);
			setShowErrorMessage(false);
		} catch (error) {
			setErrorMessage('Error updating avatar. Try again!');
			setShowErrorMessage(true);
		}
		const myProf = await getPrivateProfile(userID);
		// setUpdatedUser(myProf);
		setUser(myProf);
		localStorage.setItem('user', JSON.stringify(myProf));
	};

	   // Extract the filename from the File object and update the state
  	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    	const file = e.target.files ? e.target.files[0] : null;
    	console.log('Selected file:', file);
    	if (file) {
      		setNewAvatar(file);
			setSelectedImage(URL.createObjectURL(file));
			setImageBorder('3px dashed rgba(0, 102, 204, 1)');
    	}
  	};

	const OnLogoutButtonClick = async () => {
		onLogout()

		console.log('User avatarPath:', user?.avatarPath);
		navigate(`/`);
	};
	
	return (
		<div style={styles.pageStyle}>
			<p style={styles.settingsTitleStyle}>Settings</p>
			<img
				className='user-card__image'
				src={selectedImage}
				alt='user.avatarPath'
				onError={({ currentTarget }) => {
					currentTarget.onerror = null;
					currentTarget.src = '/default_pfp.png';
				}}
				style={{...styles.profilePictureStyle, border}}

			/>
			<label style={styles.customAvatarUploadButtonStyle}>
		  		<input type="file" onChange={handleAvatarChange} style={styles.avatarInputFieldStyle}/>
				<img src={imageAssetUploadAvatar} style={styles.imageUploadButtonIconStyle}></img>
				Upload file from computer
			</label>
			<button style={styles.updateButtonStyle} onClick={handleUpdateAvatar}>Update avatar</button>
			<br/>
		  	<input
				type="text"
				placeholder={user?.username}
				value={newUsername}
				onChange={(e) => setNewUsername(e.target.value)} // Update state on change
				style={styles.formFieldStyle}
		  	/>
		  	<button style={styles.updateButtonStyle} onClick={handleUpdateUsername}>Update</button>
			{showErrorMessage && <p>{ErrorMessage}</p>}
			<button style={styles.logoutButtonStyle} onClick={OnLogoutButtonClick}>Logout</button>
	  	</div>
  	);
};

export default SettingsPage;