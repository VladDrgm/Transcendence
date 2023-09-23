import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { fetchAddress } from '../div/channel_div';
import { updateAvatarApi, updateUsernameApi } from '../../api/userApi';
import { getPrivateProfile } from '../../api/profile.api';
import * as styles from './SettingsPageStyles';
import imageAssetUploadAvatar from '../assets/uploadAvatar.png'
import ErrorPopup from '../Popups/ErrorPopup';

interface SettingsPageProps
{
	onLogout: () => void;
}

// Component
const SettingsPage: React.FC<SettingsPageProps> = ({onLogout}) => {
	const { user, setUser } = useUserContext();
	const userID = user?.userID;

	const [newUsername, setNewUsername] = useState('');
	const [newAvatar, setNewAvatar] = useState<File | null>(null)
	const [selectedImage, setSelectedImage] = useState<string>(fetchAddress.slice(0, -1) + user?.avatarPath?.slice(1));

	const [border, setImageBorder] = useState<string>('3px solid rgba(254, 8, 16, 1)');
	
	const [error, setError] = useState<string | null>(null);
	
	const navigate = useNavigate();

	//   // Add a conditional rendering to check if user is available
	//   if (!user || !user.avatarPath) {
	// 	// Return a loading state or null
	// 	return <p>Loading...</p>;
	//   }

	const handleUpdateUsername = async () => {
		if (!(newUsername.trim().length !== 0)) {
			setError('Please put in a username to continue!');
  			return;
		}
		let updatedUser =  null;
		try {
			// Call the API function and get the updated user object
			updatedUser = await updateUsernameApi(userID, newUsername, user?.intraUsername, user?.passwordHash);
	  
			// Update the state and local storage with the updated user object
			
	  
			// Clear the input field after successful update
			setNewUsername('');
		} catch (error) {
			setError('Error updating username. Try again!');
			return;
		}
        user!.username = updatedUser.username;
		setUser(user);
		localStorage.setItem('user', JSON.stringify(user));
	};

	const handleUpdateAvatar = async () => {
		try {
			if (!newAvatar) {
				setError('Please select an image to upload');
  				return;
			}

			const formData = new FormData();
			formData.append('file', newAvatar);
			await updateAvatarApi(userID, formData, user?.intraUsername, user?.passwordHash);
			setImageBorder('3px solid rgba(254, 8, 16, 1)');
			setNewAvatar(null);
		} catch (error) {
			setError('Error updating avatar. Try again!');
			return;
		}
		const myProf = await getPrivateProfile(userID, user?.intraUsername, user?.passwordHash);
		// setUpdatedUser(myProf);
        user!.avatarPath = myProf.avatarPath;
		setUser(user);
        setSelectedImage(fetchAddress.slice(0, -1) + user?.avatarPath?.slice(1));
		localStorage.setItem('user', JSON.stringify(user));
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
			<button style={styles.logoutButtonStyle} onClick={OnLogoutButtonClick}>Logout</button>
			<ErrorPopup message={error} onClose={() => setError(null)} />
	  	</div>
  	);
};

export default SettingsPage;